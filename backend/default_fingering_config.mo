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
      ("C", [true, true, true, true, true, true, true, true, true]),
      ("D", [true, true, true, true, true, true, true, true, false]),
      ("E", [true, true, true, true, true, true, true, false, false]),
      ("F", [true, true, true, true, true, true, false, false, false]),
      // Additional notes can be added here
    ];
    name = "Default";
  };
};
