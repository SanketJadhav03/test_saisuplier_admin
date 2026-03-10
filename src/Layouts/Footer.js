import React from "react";
import { Col, Container, Row } from "reactstrap";
import packageJson from "../../package.json";

const Footer = () => {
  const reactVersion = packageJson.version;
  return (
    <React.Fragment>
      <footer className="footer  fw-bold">
        <Container fluid>
          <Row>
            <Col sm={5}>
              Copyright © {new Date().getFullYear()} Saisupplier Admin . All rights
              reserved.
            </Col>
            <Col sm={5}>
              <div className="text-sm-end d-none d-sm-block  fw-bold">
                Product by Ajspire Technologies Pvt. Ltd
              </div>
            </Col>
            <Col sm={2}>
              <div className="text-sm-end d-none d-sm-block fw-bold">
                Version {reactVersion}
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
