module {
  type Note = Text;
  type Fingering = [Bool];

  public type OcarinaFingeringConfig = {
    instrumentType : Text;
    fingerings : [(Note, Fingering)];
    name : Text;
  };

  public let defaultConfig : OcarinaFingeringConfig = {
    instrumentType = "Alto C Ocarina";
    fingerings = [
      ("C4", [true, true, true, true, true, true, true, true, true]),
      ("D4", [true, true, true, true, true, true, true, true, false]),
      ("E4", [true, true, true, true, true, true, true, false, false]),
      ("F4", [true, true, true, true, true, true, false, false, false]),
      // Additional notes can be added here
    ];
    name = "Default";
  };
};
