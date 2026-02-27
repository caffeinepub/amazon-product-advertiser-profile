import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ProductListing = {
    title : Text;
    description : Text;
    thumbnailUrl : Text;
    amazonUrl : Text;
    price : ?Text;
  };

  // UserProfile type as required by the frontend
  public type UserProfile = {
    displayName : Text;
    bio : Text;
    profilePhotoUrl : Text;
    socialHandle : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<Principal, [ProductListing]>();

  // --- Required profile functions for frontend ---

  // Get the caller's own profile (must be authenticated user)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  // Save the caller's own profile (must be authenticated user)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Get any user's profile — public, no auth required (visitors can view)
  public query func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  // --- Product Listing Management ---

  // Add a product — must be authenticated user (owner)
  public shared ({ caller }) func addProduct(product : ProductListing) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add products");
    };
    let userProducts = switch (products.get(caller)) {
      case (null) { [product] };
      case (?existing) { existing.concat([product]) };
    };
    products.add(caller, userProducts);
  };

  // Update a product by index — must be authenticated user (owner)
  public shared ({ caller }) func updateProduct(index : Nat, product : ProductListing) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update products");
    };
    switch (products.get(caller)) {
      case (null) { Runtime.trap("No products found") };
      case (?userProducts) {
        if (index >= userProducts.size()) { Runtime.trap("Invalid index") };
        let updatedProducts = Array.tabulate(
          userProducts.size(),
          func(i) {
            if (i == index) { product } else { userProducts[i] };
          },
        );
        products.add(caller, updatedProducts);
      };
    };
  };

  // Remove a product by index — must be authenticated user (owner)
  public shared ({ caller }) func removeProduct(index : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can remove products");
    };
    switch (products.get(caller)) {
      case (null) { Runtime.trap("No products found") };
      case (?userProducts) {
        if (index >= userProducts.size()) { Runtime.trap("Invalid index") };
        let updatedProducts = Array.tabulate(
          userProducts.size() - 1,
          func(i) {
            if (i < index) { userProducts[i] } else { userProducts[i + 1] };
          },
        );
        products.add(caller, updatedProducts);
      };
    };
  };

  // Get products for any user — public, no auth required (visitors can view)
  public query func getProducts(user : Principal) : async [ProductListing] {
    switch (products.get(user)) {
      case (null) { [] };
      case (?userProducts) { userProducts };
    };
  };
};
