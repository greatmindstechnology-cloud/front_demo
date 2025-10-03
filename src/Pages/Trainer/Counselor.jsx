import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Counselor() {
    
    const navigate = useNavigate();

    return (

        <>
            <div className='d-flex justify-content-center align-items-center h-100 bg-light'>
                <div class="card border border-0 shadow " style={{ width: "34rem" }}>
                    <div class="card-body">
                        <form  className="row g-4 p-4 d-flex justify-content-center ">

                        <div className='col-12'><h2 className="h4 fw-bold text-dark">Basic Information</h2></div>

                        <div className="col-12">
                            <label className="form-label">Domains <span className="text-danger">*</span></label>
                            <select class="form-select" aria-label="Default select example">
                                <option selected>Open this select menu</option>
                                <option value="1">Python</option>
                                <option value="2">Django</option>
                                <option value="3">java</option>
                            </select>
                        </div>

                        <div class="col-12 ">
                            <label for="exampleFormControlTextarea1" class="form-label">Why interested</label>
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>

                        <div className="col-12">
                            <label className="form-label">Availability<span className="text-danger">*</span></label>
                            <input type="date" name="author_name" className="form-control" required maxLength="255" />
                        </div>

                        <div className="col-12">
                            <label for="formFileMultiple" class="form-label">Doc</label>
                            <input class="form-control" type="file" id="formFileMultiple" multiple />
                        </div>


                        <div className="col-12 d-flex justify-content-between mt-4">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/trainer')}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">Submit All</button>
                        </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Counselor;
