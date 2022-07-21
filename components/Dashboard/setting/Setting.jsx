import React from "react";
import Image from "next/image";
import Tab_General from "./tabs/Tab_General";
import Tab_Authentication from "./tabs/Tab_Authentication";
import Tab_Appointment from "./tabs/Tab_Appointment";


export const Setting = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <>
      <section className="settingPage">
        <section className="settingHeader">
          <span className="acntText">Account settings</span>
          <button type="button" className="btn btn-primary saveBtn">
            Save changes
          </button>
        </section>
        <section className="container light-style flex-grow-1 container-p-y detailContainer">
          <div className="card overflow-hidden">
            <div className="row no-gutters row-bordered row-border-light">
              <div className="col-md-12 pt-0">
                <div className="list-group list-group-flush account-settings-links">
                  <a
                    className={`list-group-item list-group-item-action ${
                      activeTab === 0 ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(0)}
                  >
                    General
                  </a>
                  <a
                    className={`list-group-item list-group-item-action ${
                      activeTab === 1 ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(1)}
                  >
                    Security
                  </a>
                  <a
                    className={`list-group-item list-group-item-action ${
                      activeTab === 2 ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(2)}
                  >
                    Appointment
                  </a>
                </div>
              </div>
              <div className="col-md-12">
                <div className="tab-content">
                  <div class="row pt-4">
                    <div class="col-lg-3 leftBox">
                      <label class="form-label">Profile Photo</label>
                      <div className="profileContner">
                        <Image
                          width={80}
                          height={80}
                          src="/images/avatar1.png"
                          alt="profileImge"
                          className="d-block ui-w-80"
                        />
                        <div className="media-body ml-4">
                          <div className="pickBox">
                            Pick a photo from your computer
                          </div>
                          <div className="editBox">
                            <label className="uploadImg">
                              Edit
                              <input
                                type="file"
                                className="account-settings-fileinput"
                              />
                            </label>
                            <span>Remove</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-3 prfileNameBox"> </div>
                  </div>
                  {activeTab === 0 ? (
                    <Tab_General />
                  ) : activeTab === 1 ? (
                    <Tab_Authentication />
                  ) : (
                    <Tab_Appointment />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Setting;
