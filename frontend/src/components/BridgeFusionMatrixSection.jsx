
/**
 * Matrix section component for Bridge & Fusion calculations.
 * Displays results in a 4-column matrix format matching BTL style:
 * Label | Fusion | Variable Bridge | Fixed Bridge
 */
import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatters';

const MATRIX_LABELS = [
  { key: "fullAnnualRate", label: "Full Annual Rate (%)" },
  { key: "grossLoan", label: "Gross Loan" },
  { key: "grossLTV", label: "Gross LTV" },
  { key: "npb", label: "NPB" },
  { key: "netLoan", label: "Net Loan" },
  { key: "netLTV", label: "Net LTV" },
  { key: "arrangementFee", label: "Arrangement Fee (£)" },
  { key: "procFeePct", label: "Proc Fee (%)" },
  { key: "brokerFee", label: "Broker Client Fee (£)" },
  { key: "servicedMonths", label: "Serviced Months" },
  { key: "rolledInterest", label: "Rolled Interest (£)" },
  { key: "deferred", label: "Deferred (£)" },
  { key: "totalInterest", label: "Total Interest (Defer + Rolled + Serviced)" },
  { key: "aprcAnnual", label: "APRC (%)" },
  { key: "aprcMonthly", label: "APRC (% pm)" },
  { key: "monthlyPayment", label: "Monthly Payment" },
  { key: "rollIntCoupon", label: "Roll Int Coupon (£)" },
  { key: "rollIntBBR", label: "Roll Int BBR (£)" },
  { key: "fullIntCoupon", label: "Full Int Coupon (£)" },
  { key: "fullIntBBR", label: "Full Int BBR (£)" },
  { key: "fullRateMonthly", label: "Full Rate (pm)" },
  { key: "fullCouponRateMonthly", label: "Full Coupon Rate (pm)" },
  { key: "payRateMonthly", label: "Pay Rate (pm)" },
  { key: "icr", label: "ICR" },
];

export const BridgeFusionMatrixSection = ({ results, products, calculatorId }) => {
  if (!results || !results.Fusion) return null;

  const productList = products && products.length
    ? products
    : ['Fusion', 'Variable Bridge', 'Fixed Bridge'];
  const matrixTitle = (() => {
    if (calculatorId === 'bridge') return '📊 Bridge Results Matrix';
    if (calculatorId === 'fusion') return '📊 Fusion Results Matrix';
    return '📊 Bridge & Fusion Results Matrix';
  })();

  const resolveProductData = (product) => {
    if (!results) return null;
    return results[product] || (product === 'Fusion Premier' ? results.Fusion : null);
  };

  const renderCellContent = (rowKey, productData) => {
    if (!productData) return '—';

    switch (rowKey) {
      case "fullAnnualRate":
        return `${productData.fullAnnualRate?.toFixed(2)}%`;

      case "grossLoan":
        return formatCurrency(productData.gross);

      case "grossLTV":
        return `${productData.grossLTV?.toFixed(2)}%`;

      case "npb":
        return formatCurrency(productData.npb);

      case "netLoan":
        return formatCurrency(productData.netLoanGBP);

      case "netLTV":
        return `${productData.netLTV?.toFixed(2)}%`;

      case "arrangementFee":
        return formatCurrency(productData.arrangementFeeGBP);

      case "procFeePct":
        return `${productData.procFeePct?.toFixed(2)}%`;

      case "brokerFee":
        return formatCurrency(productData.brokerFeeGBP);

      case "servicedMonths":
        return productData.servicedMonths;

      case "rolledInterest":
        return formatCurrency(productData.rolledInterestGBP);

      case "deferred":
        return formatCurrency(productData.deferredGBP);

      case "totalInterest":
        return formatCurrency(productData.totalInterest);

      case "aprcAnnual":
        return `${productData.aprcAnnual?.toFixed(2)}%`;

      case "aprcMonthly":
        return `${productData.aprcMonthly?.toFixed(2)}%`;

      case "monthlyPayment":
        return formatCurrency(productData.monthlyPaymentGBP);

      case "rollIntCoupon":
        return formatCurrency(productData.rolledIntCoupon);

      case "rollIntBBR":
        return formatCurrency(productData.rolledIntBBR);

      case "fullIntCoupon":
        return formatCurrency(productData.fullIntCoupon);

      case "fullIntBBR":
        return formatCurrency(productData.fullIntBBR);

      case "fullRateMonthly":
        return `${productData.fullRateMonthly?.toFixed(4)}%`;

      case "fullCouponRateMonthly":
        return `${productData.fullCouponRateMonthly?.toFixed(4)}%`;

      case "payRateMonthly":
        return `${productData.payRateMonthly?.toFixed(4)}%`;

      case "icr":
        return productData.icr != null ? `${productData.icr.toFixed(2)}x` : '—';

      default:
        return '—';
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "24px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        marginTop: "16px",
        gridColumn: "1 / -1",
      }}
    >
      <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>
        {matrixTitle}
      </h4>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th
                style={{
                  border: "1px solid #cbd5e1",
                  padding: "10px 12px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#0f172a",
                  minWidth: "250px",
                }}
              >
                Field
              </th>
              {productList.map((product) => {
                const productData = resolveProductData(product);
                return (
                  <th
                    key={product}
                    style={{
                      border: "1px solid #cbd5e1",
                      padding: "10px 12px",
                      textAlign: "center",
                      fontWeight: 600,
                      color: "#0f172a",
                      background: "#f1f5f9",
                      minWidth: "150px",
                    }}
                  >
                    {product}
                    <div style={{ fontSize: "11px", fontWeight: 400, color: "#64748b", marginTop: "4px" }}>
                      {productData?.ltv}% LTV
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {MATRIX_LABELS.map((row, index) => (
              <tr
                key={row.key}
                style={{
                  background: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                }}
              >
                <td
                  style={{
                    border: "1px solid #cbd5e1",
                    padding: "8px 12px",
                    fontWeight: 500,
                    color: "#334155",
                  }}
                >
                  {row.label}
                </td>
                {productList.map((product) => (
                  <td
                    key={product}
                    style={{
                      border: "1px solid #cbd5e1",
                      padding: "8px 12px",
                      textAlign: "right",
                      fontFamily: "monospace",
                      color: "#0f172a",
                    }}
                  >
                    {renderCellContent(row.key, resolveProductData(product))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          background: "#f0f9ff",
          border: "1px solid #bae6fd",
          borderRadius: "6px",
          fontSize: "13px",
          color: "#0c4a6e",
        }}
      >
        <strong>ℹ️ Note:</strong> LTV bands are automatically determined based on your Gross Loan and Property Value.
        Each product column shows calculations for its applicable LTV range (60%, 70%, or 75%).
      </div>
    </div>
  );
};

BridgeFusionMatrixSection.propTypes = {
  results: PropTypes.object,
  products: PropTypes.arrayOf(PropTypes.string),
  calculatorId: PropTypes.string,
};

BridgeFusionMatrixSection.defaultProps = {
  products: undefined,
  calculatorId: undefined,
};
