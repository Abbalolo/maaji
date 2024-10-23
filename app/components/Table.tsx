
import React from 'react';

import CustomTables from './CustomTables';
import ChampionsTables from './championsTables';
import ConfferenceTables from './ConfferenceTables';



function Table() {


  return (
    <div className="container p-4">
      <CustomTables/>
      <ChampionsTables/>
      <ConfferenceTables/>
    </div>
  );
}

export default Table;
