import React from "react";
// import { enrichmentData } from "../data/enrichmentData";

interface EnrichmentPanelProps {
  fruit: string;
}

const EnrichmentPanel: React.FC<EnrichmentPanelProps> = ({ fruit }) => {
  return (
    <div>
      <strong>{fruit} Enrichment</strong>
      {/* <div style={{ marginTop: 8 }}>
        {enrichmentData[fruit] || "No enrichment data available."}
      </div> */}
    </div>
  );
};

export default EnrichmentPanel;
