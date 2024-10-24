import React from "react";
import { Form } from "react-router-dom";
import {Button, Col, Container, FormGroup, Input, Label, Row} from "reactstrap";

const DynamicInput = ({field, formData, changeHandler}) => {
  return (
    <FormGroup key={field.name} row>
      <Label for={field.name} sm={2}>
        {field.label}:
      </Label>
      <Col sm={10}>
        {field.type === 'checkbox' ? (
          <Input className="ml-1 mt-3"
            type="checkbox"
            name={field.name}
            checked={formData[field.name]}
            onChange={changeHandler}
          />
        ) : field.type === 'select' ? (
          <Input
            type="select"
            name={field.name}
            value={formData[field.name]}
            onChange={changeHandler}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Input>
        ) : (
          <Input
            type={field.type || 'text'}
            name={field.name}
            value={formData[field.name]}
            onChange={changeHandler}
          />
        )}
      </Col>
    </FormGroup>
  );
};

export const BaseForm = ({formFields, buttonLabel, method, action}) => {
  const [formData, setFormData] = React.useState(() => {
    const initialData = {};
    formFields.forEach((field) => {
      initialData[field.name] = '';
    });
    return initialData;
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <Container fluid className="p-md-3">
      <Form method={method} action={action}>
        {formFields.map((field) => (
          <>
            <DynamicInput field={field} formData={formData}
                changeHandler={handleInputChange} />
            {field.type === 'checkbox' && formData[field.name] &&
              field.conditional.map((cfield) => (
                <DynamicInput field={cfield} formData={formData}
                    changeHandler={handleInputChange} />
              ))}
          </>
        ))}
      </Form>
      <div className="text-right">
        <Button color="default" type="submit">{buttonLabel}</Button>
      </div>
    </Container>
  );

};
