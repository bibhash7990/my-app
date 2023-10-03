
import React, { useState,  useMemo } from 'react';

function Calculator() {
  const [userValues, setUserValues] = useState({
    amount: '',
    interest: '',
    term: '',
    timeUnit: 'years',
  });

  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    setUserValues({ ...userValues, [event.target.name]: event.target.value });
  };

  const isValid = () => {
    const { amount, interest, term } = userValues;
    let actualError = '';
    if (!amount || !interest || !term) {
      actualError = 'All the values are required';
    }
    if (isNaN(amount) || isNaN(interest) || isNaN(term)) {
      actualError = 'All the values must be a valid number';
    }
    if (Number(amount) <= 0 || Number(interest) <= 0 || Number(term) <= 0) {
      actualError = 'All the values must be a positive number';
    }
    if (actualError) {
      setError(actualError);
      return false;
    }
    return true;
  };

  const calculateResults = ({ amount, interest, term, timeUnit }) => {
    const userAmount = Number(amount);
    const calculatedInterest = Number(interest) / 100 / 12;
    const calculatedPayments =
      timeUnit === 'months' ? Number(term) : Number(term) * 12;
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (userAmount * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      const monthlyPaymentCalculated = monthly.toFixed(2);
      const totalPaymentCalculated = (monthly * calculatedPayments).toFixed(2);
      const totalInterestCalculated = (monthly * calculatedPayments - userAmount).toFixed(2);

      const results = {
        monthlyPayment: monthlyPaymentCalculated,
        totalPayment: totalPaymentCalculated,
        totalInterest: totalInterestCalculated,
      };
      return results;
    }

    return null;
  };

  const memoizedResults = useMemo(() => {
    if (submitted && isValid()) {
      setError('');
      return calculateResults(userValues);
    }
    return null;
  }, [submitted, userValues]);

  const clearFields = () => {
    setUserValues({
      amount: '',
      interest: '',
      term: '',
      timeUnit: 'years',
    });
    setSubmitted(false)
  };

  const handleSubmit = () => {
    if (isValid()) {
        setSubmitted(true);
    }
  };

  return (
    <div className='calculator'>
      <div className='form'>
        <h1>Loan Calculator</h1>
        <p className='error'>{error}</p>
        <form onSubmit={(e) => e.preventDefault()}>
            {!submitted ? (
                <div className='form-items'>
                <div>
                  <label id='label'>Amount:</label>
                  <input
                    type='text'
                    name='amount'
                    placeholder='Loan amount'
                    value={userValues.amount}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label id='label'>Interest:</label>
                  <input
                    type='text'
                    name='interest'
                    placeholder='Interest'
                    value={userValues.interest}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label id="label">Term:</label>
                  <input
                    type="text"
                    name="term"
                    placeholder="Term"
                    value={userValues.term}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label id="label">Time Unit:</label>
                  <select
                    name="timeUnit"
                    value={userValues.timeUnit}
                    onChange={handleInputChange}
                  >
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
                <input
                  type='submit'
                  className='button'
                  onClick={handleSubmit}
                />
              </div>
                ) : (
                submitted && (
                    <div className="form-items">
                        <h4>
                      Loan amount: ${userValues.amount} <br /> Interest: {userValues.interest}% <br />
                      Term: {userValues.term} {userValues.timeUnit}
                    </h4>
                    <div>
                      <label id="label">Monthly Payment:</label>
                      <input type="text" value={memoizedResults.monthlyPayment} disabled />
                    </div>
                    <div>
                      <label id="label">Total Payment: </label>
                      <input type="text" value={memoizedResults.totalPayment} disabled />
                    </div>
                    <div>
                      <label id="label">Total Interest:</label>
                      <input type="text" value={memoizedResults.totalInterest} disabled />
                    </div>
                    <input
                      className="button"
                      value="Calculate again"
                      type="button"
                      onClick={clearFields}
                      />
                  </div>
                )
            )
            }
      </form>
      </div>
    </div>
  );
}

export default Calculator;
















