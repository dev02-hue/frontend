import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

// Define account number formats for different countries
const countriesData = {
  USA: { accountNumber: "US1234567890", type: "Domestic Bank Account" },
  Canada: { accountNumber: "CA0987654321", type: "Transit Number & Account Number" },
  UK: { accountNumber: "GB9876543210", type: "IBAN (International Bank Account Number)" },
  Germany: { accountNumber: "DE1239876543", type: "IBAN (International Bank Account Number)" },
  Australia: { accountNumber: "AU4567890123", type: "BSB (Bank State Branch) & Account Number" },
  Brazil: { accountNumber: "BR12345678901234567890", type: "Brazilian Bank Account (with branch code)" },
  France: { accountNumber: "FR7630006000011234567890189", type: "IBAN (International Bank Account Number)" },
  India: { accountNumber: "IN1234567890123456789", type: "Indian Bank Account (with IFSC code)" },
  Spain: { accountNumber: "ES9121000418450200051332", type: "IBAN (International Bank Account Number)" },
  Japan: { accountNumber: "JP012345678901234567", type: "Japanese Bank Account" },
  Mexico: { accountNumber: "MX1234567890123456", type: "CLABE (Clave Bancaria Estandarizada)" },
};

type CountryCode = keyof typeof countriesData;

const BankTransfer: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [paymentMade, setPaymentMade] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value as CountryCode;
    setSelectedCountry(country);
    setAccountNumber(countriesData[country]?.accountNumber || null);
    setAccountType(countriesData[country]?.type || null);
  };

  const handlePayment = () => {
    if (!selectedCountry) {
      setErrorMessage("Please select a country first.");
      return;
    }
    setPaymentMade(true);
    setErrorMessage(null);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setReceipt(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receipt) {
      setErrorMessage("Please upload a receipt.");
    } else {
      setErrorMessage(null);
      // Handle the receipt submission logic here
      alert("Receipt uploaded successfully!");
    }
  };

  return (
    <div className="container mt-4">
      <Helmet>
        <title>Bank Transfer Payment</title>
      </Helmet>
      <h2>Bank Transfer Payment</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="countrySelect">
          <Form.Label>Select Country</Form.Label>
          <Form.Select onChange={handleCountryChange}>
            <option value="">-- Select Country --</option>
            {Object.keys(countriesData).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {selectedCountry && accountNumber && accountType && (
          <div className="mt-3">
            <h4>Bank Account Number</h4>
            <p>Account Number: {accountNumber}</p>
            <p>Account Type: {accountType}</p>
          </div>
        )}

        {selectedCountry && !paymentMade && accountNumber && (
          <Button variant="primary" onClick={handlePayment} className="mt-3">
            Make Payment
          </Button>
        )}

        {paymentMade && (
          <div className="mt-3">
            <h4>Upload Payment Receipt</h4>
            <Form.Group controlId="receiptUpload">
              <Form.Label>Upload your receipt</Form.Label>
              <Form.Control
                type="file"
                onChange={handleReceiptUpload}
                accept="image/*, .pdf"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">
              Submit Receipt
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default BankTransfer;
