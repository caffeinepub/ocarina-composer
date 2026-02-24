import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import DefaultFingeringConfig "default_fingering_config";



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

  // State
  stable var fingeringDefaults : OcarinaFingeringConfig = DefaultFingeringConfig.defaultConfig;
  var nextCompositionId = 0;
  let compositions = Map.empty<Nat, Composition>();

  // Fingering Defaults Functions
  public query ({ caller }) func getFingeringDefaults() : async OcarinaFingeringConfig {
    fingeringDefaults;
  };

  public shared ({ caller }) func setFingeringDefaults(config : OcarinaFingeringConfig) : async () {
    fingeringDefaults := config;
  };

  public shared ({ caller }) func resetFingeringDefaults() : async () {
    fingeringDefaults := DefaultFingeringConfig.defaultConfig;
  };

  // Composition Functions
  public shared ({ caller }) func saveComposition(title : Text, description : Text, midiData : Blob) : async Nat {
    if (Text.equal(title, "")) {
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

