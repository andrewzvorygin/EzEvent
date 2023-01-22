import React from "react";
import { Typography } from "@mui/material";

import SmallTitle from "./SmallTitle";

interface DescriptionPropsType {
  description: string | undefined;
}

const Description: React.FC<DescriptionPropsType> = ({ description = "" }) => {
  return (
    <>
      <SmallTitle mb={2}>Описание:</SmallTitle>
      {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </>
  );
};

export default Description;
