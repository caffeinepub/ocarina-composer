import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import DefaultFingeringConfig "default_fingering_config";
import Principal "mo:core/Principal";



actor {
  // Types
  type Note = Text;
  type Fingering = [Bool];

  public type OcarinaFingeringConfig = {
    instrumentType : Text;
    fingerings : [(Note, Fingering)];
    name : Text;
  };

  type Composition = {
    title : Text;
    description : Text;
    midiData : Blob;
  };

  // State (adminPrincipal is now persisted)
  var adminPrincipal : ?Principal = null;
  let fingeringConfigs = Map.empty<Principal, OcarinaFingeringConfig>();
  var nextCompositionId = 0;
  let compositions = Map.empty<Nat, Composition>();

  // Admin Check
  func checkAdmin(caller : Principal) {
    switch (adminPrincipal) {
      case (null) { Runtime.trap("Admin not set: First admin must call this function") };
      case (?admin) {
        if (caller != admin) {
          Runtime.trap("Unauthorized access: Only admin can perform this operation");
        };
      };
    };
  };

  // Function to initialize admin
  func initializeAdmin(caller : Principal) {
    switch (adminPrincipal) {
      case (null) { adminPrincipal := ?caller };
      case (?_) { () };
    };
  };

  // Fingering Defaults Functions (Admin Only)
  public query ({ caller }) func getFingeringDefaults() : async OcarinaFingeringConfig {
    // Public function, no admin required
    switch (adminPrincipal) {
      case (null) { DefaultFingeringConfig.defaultConfig };
      case (?_admin) {
        switch (fingeringConfigs.get(_admin)) {
          case (null) { DefaultFingeringConfig.defaultConfig };
          case (?config) { config };
        };
      };
    };
  };

  public shared ({ caller }) func setFingeringDefaults(config : OcarinaFingeringConfig) : async () {
    initializeAdmin(caller);
    checkAdmin(caller);
    switch (adminPrincipal) {
      case (null) { Runtime.trap("Admin not set") };
      case (?_admin) {
        fingeringConfigs.add(_admin, config);
      };
    };
  };

  public shared ({ caller }) func resetFingeringDefaults() : async () {
    checkAdmin(caller);
    switch (adminPrincipal) {
      case (null) { Runtime.trap("Admin not set") };
      case (?_admin) {
        fingeringConfigs.remove(_admin);
      };
    };
  };

  // Composition Functions
  public shared ({ caller }) func saveComposition(title : Text, description : Text, midiData : Blob) : async Nat {
    if (title.size() == 0) {
      Runtime.trap("Title cannot be empty");
    };

    let composition : Composition = {
      title;
      description;
      midiData;
    };

    compositions.add(nextCompositionId, composition);
    let currentId = nextCompositionId;
    nextCompositionId += 1;

    currentId;
  };

  public query ({ caller }) func getComposition(id : Nat) : async Composition {
    switch (compositions.get(id)) {
      case (null) { Runtime.trap("Composition not found") };
      case (?composition) { composition };
    };
  };

  public query ({ caller }) func listCompositions() : async [(Nat, Composition)] {
    compositions.toArray();
  };
};
