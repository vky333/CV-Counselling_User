import React from "react";
import { FormControl } from "react-bootstrap";
const Tab_Appointment = () => {
  return (
    <div className="tab-pane tbBox fade active show" id="bookApoinment">
      <div className="card-body pb-2 ">
      <div className="row borderTop">
        <h3><b>Book Timings</b></h3>

        <div className="weekDayContainer">
          <h6>Days</h6>
          <ul>
            <li>
              <input
                type="checkbox"
                id="mo-1"
                className="weekdayInput"
                name="weekDays"
                value="mo-1"
              />
              <label for="mo-1" className="checkBoxLable">
                M
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="tu-2"
                className="weekdayInput"
                name="weekDays"
                value="tu-2"
              />
              <label for="tu-2" className="checkBoxLable">
                Tu
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="we-3"
                className="weekdayInput"
                name="weekDays"
                value="we-3"
              />
              <label for="we-3" className="checkBoxLable">
                We
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="th-4"
                className="weekdayInput"
                name="weekDays"
                value="th-4"
              />
              <label for="th-4" className="checkBoxLable">
                Th
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="fri-5"
                className="weekdayInput"
                name="weekDays"
                value="fri-5"
              />
              <label for="fri-5" className="checkBoxLable">
                Fr
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="sat-6"
                className="weekdayInput"
                name="weekDays"
                value="sat-6"
              />
              <label for="sat-6" className="checkBoxLable">
                Sa
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="sun-7"
                className="weekdayInput"
                name="weekDays"
                value="sun-7"
              />
              <label for="sun-7" className="checkBoxLable">
                Su
              </label>
            </li>
          </ul>
          <div className="sessionContainer">
            <h6>Sessions 1</h6>
            <div className="session01">
              <div className="form-group">
                <select className="custom-select form-control">
                  <option>12:15 AM</option>
                  <option selected="">12:30 AM</option>
                  <option>12:45 AM</option>
                  <option>1:00 AM</option>
                  <option>1:15 AM</option>
                </select>
              </div>
              <div className="form-group frmGroup02">
                <select className="custom-select form-control">
                  <option>To</option>
                  <option selected="">12:30 AM</option>
                  <option>12:45 AM</option>
                  <option>1:00 AM</option>
                  <option>1:15 AM</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="addTimeContianer">ADD TIMING FOR REMAINING DAYS</div>
      </div>
      </div>
    </div>
  );
};

export default Tab_Appointment;
