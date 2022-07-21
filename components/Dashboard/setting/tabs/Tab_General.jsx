import React from "react";
import { FormControl } from "react-bootstrap";

const Tab_General = () => {
  return (
    <div className="tab-pane tbBox fade active show">
      <div className="card-body">
        <div className="row borderTop">
        <div className="col-md-4 ps-0">
            <div className="form-group">
              <label className="form-label">Name</label>              
              <FormControl
              type="text"
              className="cv-input-field"
              placeholder="Name" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <FormControl
              type="email"
              className="cv-input-field"
              placeholder="xyz@admin.com" />
            </div>
          </div>
          <div className="col-md-4 pe-0">
            <div className="form-group">              
              <label className="form-label">Mobile Number</label>             
              <FormControl
              type="text"
              className="cv-input-field"
              placeholder="number" />
            </div>
          </div>

          <div className="col-md-4 ps-0">
            <div className="form-group">
              <label className="form-label">Designation</label>              
              <FormControl
              type="text"
              className="cv-input-field"
              placeholder="Designation" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">Gender</label>              
              <FormControl
              type="text"
              className="cv-input-field"
              placeholder="Gender" />
            </div>
          </div>
          <div className="col-md-4 pe-0">
            <div className="form-group">
              <label className="form-label">Country</label>
              <select className="custom-select form-control">
                <option>India</option>
                <option selected="">Canada</option>
                <option>UK</option>
                <option>Germany</option>
                <option>France</option>
              </select>
            </div>
          </div>
          <div className="col-md-4 ps-0">
            <div className="form-group">
              <label className="form-label">Experience</label>             
              <FormControl
              type="text"
              className="cv-input-field"
              placeholder="Experience" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label aboutBox">About</label>
              <textarea className="form-control" rows="5"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tab_General;
