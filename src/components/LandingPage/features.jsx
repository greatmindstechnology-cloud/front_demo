import React from "react";

export const Features = (props) => {
  return (
    <div id="features" className="w-full bg-[#e9eff8b2] py-24 ">
      <div className="md:max-w-[1480px] m-auto grid  px-40 items-center">
        <div className="">
          <h2>Features</h2>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className="col-xs-6 col-md-3">
                  {" "}
                  <i className={d.icon}></i>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};

export default Features;