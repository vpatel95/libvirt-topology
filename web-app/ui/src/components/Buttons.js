import React from "react";
import {Link} from "react-router-dom";
import {Button} from "reactstrap";

export const ButtonLink = ({label, link, color, size}) => {
  return (
    <div className="col text-right">
      <Link to={link}>
        <Button color={color} size={size} >{label}</Button>
      </Link>
    </div>
  )
};
