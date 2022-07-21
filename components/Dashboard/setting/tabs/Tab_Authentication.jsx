import React from "react";
import { FormControl } from "react-bootstrap";
import styles from '../../setting/Setting.module.css'

const Tab_Authentication = () => {
  return (
    <div className="tab-pane tbBox fade active show">
      <div className="card-body pb-2">
      <div className="row borderTop">
          <div className="col-md-4 ps-0">
            <div className="form-group">
              <label className="form-label">Current password</label>              
              <FormControl
              type="text"
              className="cv-input-field"
              placeholder="Current password" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="form-label">New password</label>
              <FormControl
              type="text"
              className="cv-input-field"
              placeholder="New password" />
            </div>
          </div>
          <div className="col-md-4 pe-0">
            <div className="form-group">
              <label className="form-label">Repeat new password</label>              
              <FormControl
              type="text"
              className="cv-input-field"
              placeholder="Repeat new password" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tab_Authentication;
