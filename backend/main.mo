import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";

actor {
  type Composition = {
    title : Text;
    description : Text;
    midiData : Blob;
  };

  let compositions = Map.empty<Text, Composition>();

  public shared ({ caller }) func saveComposition(title : Text, description : Text, midiData : Blob) : async () {
    if (Text.equal(title, "")) {
      Runtime.trap("Title cannot be empty");
    };

    let composition : Composition = {
      title;
      description;
      midiData;
    };

    compositions.add(title, composition);
  };

  public query ({ caller }) func getComposition(title : Text) : async Composition {
    switch (compositions.get(title)) {
      case (null) { Runtime.trap("Composition not found") };
      case (?composition) { composition };
    };
  };

  public query ({ caller }) func listCompositions() : async [Text] {
    compositions.keys().toArray();
  };
};
