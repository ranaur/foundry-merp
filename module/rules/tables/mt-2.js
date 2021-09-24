export class TableMT2 {
    static name = "Static Maneuver table";
    static reference = "MERP p77";
    static id = "MT-2";
    static columns = [
        "id",
        "label",
        "text"
    ];
    static table = [
        [ -26, 'Blunder', 'MERP1E.StaticManeuverResult.Blunder', 'MERP1E.StaticManeuverDefaultText.Blunder' ],
        [ 4, 'Absolute Failure', 'MERP1E.StaticManeuverResult.AbsoluteFailure', 'MERP1E.StaticManeuverDefaultText.AbsoluteFailure' ],
        [ 75, 'Failure', 'MERP1E.StaticManeuverResult.Failure', 'MERP1E.StaticManeuverDefaultText.Failure' ],
        [ 90, 'Partial Success', 'MERP1E.StaticManeuverResult.PartialSuccess', 'MERP1E.StaticManeuverDefaultText.PartialSuccess' ],
        [ 110, 'Near-Success', 'MERP1E.StaticManeuverResult.NearSuccess', 'MERP1E.StaticManeuverDefaultText.NearSuccess' ],
        [ 175, 'Success', 'MERP1E.StaticManeuverResult.Success', 'MERP1E.StaticManeuverDefaultText.Success' ],
        [ 1000, 'Absolut Success', 'MERP1E.StaticManeuverResult.AbsolutSuccess', 'MERP1E.StaticManeuverDefaultText.AbsolutSuccess' ]
    ];

    static toObjectArray() {
        return this.table.reduce((acc, row) => { 
            let newRow = { roll: row[0] };
            this.columns.forEach((col, idx) => newRow[col] = row[idx+1]);
            acc.push(newRow); 
            return acc;
        }, []);
    }
};

