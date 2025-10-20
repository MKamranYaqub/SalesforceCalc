/**
 * Bridge & Fusion Calculator Component
 * Complete calculator for Bridge and Fusion loan products
 */

import React from 'react';
import { useBridgeFusionCalculator } from '../hooks/useBridgeFusionCalculator';
import { formatCurrency, formatPercentage } from '../utils/bridgeFusionCalculations';
import { LTV_OPTIONS } from '../config/bridgeFusionRates';

const BridgeFusionCalculator = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    purchasePrice,
    setPurchasePrice,
    propertyType,
    setPropertyType,
    rent,
    setRent,
    topSlicing,
    setTopSlicing,
    propertyTypeOptions,
    results,
    bestResult
  } = useBridgeFusionCalculator();

  const isFusion = selectedProduct === 'Fusion';

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Bridge & Fusion Calculator</h1>
        <p className="text-gray-600 mt-2">Calculate loan options for Bridge and Fusion products</p>
      </div>

      {/* Product Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Product
        </label>
        <div className="flex gap-4">
          {['Fusion', 'Fixed Bridge', 'Variable Bridge'].map((product) => (
            <button
              key={product}
              onClick={() => setSelectedProduct(product)}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                selectedProduct === product
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {product}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Loan Details</h2>
        
        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Price (£)
          </label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            placeholder="Enter purchase price"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {propertyTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Fusion-specific inputs */}
        {isFusion && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent (£)
              </label>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                placeholder="Enter monthly rent"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Top Slicing (£ per month)
              </label>
              <input
                type="number"
                value={topSlicing}
                onChange={(e) => setTopSlicing(e.target.value)}
                placeholder="Enter top slicing amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}
      </div>

      {/* Best Result Summary */}
      {bestResult && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">🏆 Best Option</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100 text-sm">LTV</p>
              <p className="text-2xl font-bold">{bestResult.ltv}%</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Gross Loan</p>
              <p className="text-2xl font-bold">{formatCurrency(bestResult.grossLoan)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Net Loan</p>
              <p className="text-2xl font-bold">{formatCurrency(bestResult.netLoan)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Monthly Rate</p>
              <p className="text-2xl font-bold">{formatPercentage(bestResult.monthlyRate)}</p>
            </div>
          </div>
          {isFusion && bestResult.icr && (
            <div className="mt-4 pt-4 border-t border-blue-400">
              <p className="text-blue-100 text-sm">Interest Coverage Ratio (ICR)</p>
              <p className="text-2xl font-bold">{bestResult.icr.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}

      {/* Results Matrix */}
      {results && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-900">All LTV Options</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  {LTV_OPTIONS.map(ltv => (
                    <th key={ltv} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {ltv}% LTV
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Gross Loan */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Gross Loan
                  </td>
                  {LTV_OPTIONS.map(ltv => (
                    <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(results[ltv].grossLoan)}
                    </td>
                  ))}
                </tr>

                {/* Net Loan */}
                <tr className="hover:bg-gray-50 bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Net Loan
                  </td>
                  {LTV_OPTIONS.map(ltv => (
                    <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                      {formatCurrency(results[ltv].netLoan)}
                    </td>
                  ))}
                </tr>

                {/* Arrangement Fee */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Arrangement Fee (£)
                  </td>
                  {LTV_OPTIONS.map(ltv => (
                    <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(results[ltv].arrangementFee)}
                    </td>
                  ))}
                </tr>

                {/* Arrangement Fee % */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Arrangement Fee (%)
                  </td>
                  {LTV_OPTIONS.map(ltv => (
                    <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatPercentage(results[ltv].arrangementFeePct)}
                    </td>
                  ))}
                </tr>

                {/* Base/Coupon Rate */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {isFusion ? 'Coupon Rate (Annual)' : 'Base Rate'}
                  </td>
                  {LTV_OPTIONS.map(ltv => (
                    <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatPercentage(isFusion ? results[ltv].couponRate : results[ltv].baseRate)}
                    </td>
                  ))}
                </tr>

                {/* BBR */}
                {(isFusion || selectedProduct === 'Variable Bridge') && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      BBR
                    </td>
                    {LTV_OPTIONS.map(ltv => (
                      <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatPercentage(results[ltv].bbr)}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Full Rate */}
                <tr className="hover:bg-gray-50 bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {isFusion ? 'Full Annual Rate' : 'Full Rate (Annual)'}
                  </td>
                  {LTV_OPTIONS.map(ltv => (
                    <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900">
                      {formatPercentage(isFusion ? results[ltv].fullAnnualRate : results[ltv].fullRate)}
                    </td>
                  ))}
                </tr>

                {/* Monthly Rate */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Monthly Rate
                  </td>
                  {LTV_OPTIONS.map(ltv => (
                    <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatPercentage(results[ltv].monthlyRate)}
                    </td>
                  ))}
                </tr>

                {/* Monthly Interest */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Monthly Interest Payment
                  </td>
                  {LTV_OPTIONS.map(ltv => (
                    <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(results[ltv].monthlyInterest)}
                    </td>
                  ))}
                </tr>

                {/* Net LTV */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Net LTV
                  </td>
                  {LTV_OPTIONS.map(ltv => (
                    <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatPercentage(results[ltv].netLtv)}
                    </td>
                  ))}
                </tr>

                {/* ICR (Fusion only) */}
                {isFusion && (
                  <tr className="hover:bg-gray-50 bg-yellow-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ICR
                    </td>
                    {LTV_OPTIONS.map(ltv => (
                      <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-900">
                        {results[ltv].icr ? results[ltv].icr.toFixed(2) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Tier (Fusion only) */}
                {isFusion && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Tier
                    </td>
                    {LTV_OPTIONS.map(ltv => (
                      <td key={ltv} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {results[ltv].tier}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Calculator Information</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Fusion:</strong> Annual tracker product (Rate + BBR), uses ICR calculation</li>
          <li>• <strong>Fixed Bridge:</strong> Fixed annual rate, no ICR required</li>
          <li>• <strong>Variable Bridge:</strong> Monthly tracker product (Rate + BBR/12), no ICR required</li>
          <li>• <strong>Best Option:</strong> Determined by highest net loan amount</li>
          <li>• <strong>Arrangement Fee:</strong> Automatically deducted from gross loan to calculate net loan</li>
        </ul>
      </div>
    </div>
  );
};

export default BridgeFusionCalculator;