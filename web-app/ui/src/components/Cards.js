import React from "react";
import {CardHeader, Row} from "reactstrap";
import {ButtonLink} from "./Buttons";

export const CardHeaderWithButton = ({header, label, link, color, size}) => {
  return (
    <CardHeader className="border-0">
      <Row className="align-items-center">
        <div className="col">
          <h3 className="mb-0">{header}</h3>
        </div>
        <ButtonLink label={label} link={link}
          color={color} size={size} />
      </Row>
    </CardHeader>
  );
};

CardHeaderWithButton.defaultProps = {
  color: 'primary',
  size: 'sm'
};

export const CardHeaderSimple = ({header}) => {
  return (
    <CardHeader className="border-1">
      <Row className="align-items-center text-center">
        <div className="col">
          <h2 className="mb-0">{header}</h2>
        </div>
      </Row>
    </CardHeader>
  );
};
