import React from "react";
import {useNavigate} from "react-router-dom";
import {Button, CardHeader, Row} from "reactstrap";

export const CardHeaderWithButton = ({header, label, link, ...buttonProps}) => {
  const navigate = useNavigate();
  return (
    <CardHeader className="border-0">
      <Row className="align-items-center">
        <div className="col">
          <h3 className="mb-0">{header}</h3>
        </div>
        <Button onClick={() => navigate(link)} {...buttonProps} >{label}</Button>
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
