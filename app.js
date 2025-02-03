function NegotiationCalculator() {
    const [state, setState] = React.useState({
        baseRevenue: 8400000,
        runsPerEpisode: 6,
        feePerEpisode: 60000,
        paymentSchedule: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        },
        alternativeDeal: 3000000,
        activeTab: 'calculator'
    });

    const RECOMMENDED_RANGES = {
        runsPerEpisode: { min: 4, max: 8 },
        feePerEpisode: { min: 30000, max: 60000 }
    };

    const isInRecommendedRange = (field, value) => {
        if (!RECOMMENDED_RANGES[field]) return true;
        return value >= RECOMMENDED_RANGES[field].min && value <= RECOMMENDED_RANGES[field].max;
    };

    const calculateRunsAdjustment = () => {
        const baseRuns = 6;
        const runsAdjustment = (state.runsPerEpisode - baseRuns) * 800000;
        return runsAdjustment;
    };

    const calculateTotalRevenue = () => {
        return state.baseRevenue + calculateRunsAdjustment();
    };

    const calculateLicensingFee = () => {
        return state.feePerEpisode * 100; // 100 episodes
    };

    const calculatePaymentSavings = () => {
        const totalLicensing = calculateLicensingFee();
        return Object.entries(state.paymentSchedule).reduce((acc, [year, percentage]) => {
            const payment = totalLicensing * (percentage / 100);
            const savings = payment * (year * 0.1); // 10% savings per year
            return acc + savings;
        }, 0);
    };

    const calculateNetLicensingFee = () => {
        return calculateLicensingFee() - calculatePaymentSavings();
    };

    const calculateFinalValue = () => {
        return calculateTotalRevenue() - calculateNetLicensingFee() - state.alternativeDeal;
    };

    const handleInputChange = (field, value) => {
        let parsedValue = parseFloat(value) || 0;
        
        // Remove strict validation, allow any number
        if (field === 'runsPerEpisode') {
            parsedValue = Math.max(1, parsedValue); // Minimum 1 run
        }
        
        if (field === 'feePerEpisode') {
            parsedValue = Math.max(0, parsedValue); // Minimum 0 fee
        }

        setState(prev => ({
            ...prev,
            [field]: parsedValue
        }));
    };

    const handlePaymentScheduleChange = (year, value) => {
        let parsedValue = parseFloat(value) || 0;
        
        setState(prev => ({
            ...prev,
            paymentSchedule: {
                ...prev.paymentSchedule,
                [year]: parsedValue
            }
        }));
    };

    // Calculate total payment percentage
    const totalPaymentPercentage = Object.values(state.paymentSchedule).reduce((sum, value) => sum + value, 0);

    const renderExplanationContent = () => {
        return (
            <div className="space-y-6">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Base Revenue Calculation</h3>
                    <div className="prose max-w-none">
                        <p className="text-gray-600 mb-2">The base revenue is calculated based on demographic ratings:</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>2-3 rating points: $7,000,000 (20% likelihood)</li>
                            <li>3-4 rating points: $8,000,000 (50% likelihood)</li>
                            <li>4-5 rating points: $9,000,000 (10% likelihood)</li>
                            <li>5-6 rating points: $10,000,000 (10% likelihood)</li>
                            <li>6-7 rating points: $11,000,000 (10% likelihood)</li>
                        </ul>
                        <p className="text-gray-600 mt-2">Expected Value = $8,400,000</p>
                        <p className="text-gray-600 mt-2 text-sm">Formula: (0.20 × $7M) + (0.50 × $8M) + (0.10 × $9M) + (0.10 × $10M) + (0.10 × $11M)</p>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Runs Adjustment</h3>
                    <div className="prose max-w-none">
                        <p className="text-gray-600 mb-2">Base calculation assumes 6 runs per episode.</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Each additional run (up to 8): +$800,000</li>
                            <li>Each fewer run: -$800,000</li>
                            <li>Recommended range: 4-8 runs</li>
                        </ul>
                        <p className="text-gray-600 mt-2 text-sm">Formula: (Actual Runs - 6) × $800,000</p>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Payment Schedule Savings</h3>
                    <div className="prose max-w-none">
                        <p className="text-gray-600 mb-2">Savings based on payment timing:</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Year 0 (upfront): 0% savings</li>
                            <li>Year 1: 10% savings on amount paid</li>
                            <li>Year 2: 20% savings on amount paid</li>
                            <li>Year 3: 30% savings on amount paid</li>
                            <li>Year 4: 40% savings on amount paid</li>
                            <li>Year 5: 50% savings on amount paid</li>
                        </ul>
                        <p className="text-gray-600 mt-2 text-sm">Formula: Σ (Payment in Year N × N × 10%)</p>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Final Value Calculation</h3>
                    <div className="prose max-w-none">
                        <p className="text-gray-600">The final deal value is calculated as:</p>
                        <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                            <li>Total Revenue = Base Revenue + Runs Adjustment</li>
                            <li>Licensing Fee = Fee per Episode × 100 episodes</li>
                            <li>Net Licensing Fee = Licensing Fee - Payment Savings</li>
                            <li>Final Value = Total Revenue - Net Licensing Fee - Alternative Deal ($3M)</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-6">
                <h1 className="text-3xl font-bold">Moms.com Deal Calculator</h1>
                <p className="text-sm opacity-80 mt-2">Calculate the value of your syndication deal</p>
            </div>

            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setState(prev => ({ ...prev, activeTab: 'calculator' }))}
                            className={`${
                                state.activeTab === 'calculator'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Calculator
                        </button>
                        <button
                            onClick={() => setState(prev => ({ ...prev, activeTab: 'explanation' }))}
                            className={`${
                                state.activeTab === 'explanation'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Formula Explanation
                        </button>
                    </nav>
                </div>
            </div>

            {state.activeTab === 'calculator' ? (
                <div className="grid gap-6">
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Parameters</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Runs per Episode
                                    <span className="text-sm text-gray-500 ml-2">(Recommended: 4-8)</span>
                                </label>
                                <input 
                                    type="number"
                                    min="1"
                                    value={state.runsPerEpisode}
                                    onChange={(e) => handleInputChange('runsPerEpisode', e.target.value)}
                                    className={`w-full p-3 border rounded-lg input-focus ${
                                        !isInRecommendedRange('runsPerEpisode', state.runsPerEpisode) 
                                        ? 'border-yellow-400 bg-yellow-50' 
                                        : ''
                                    }`}
                                />
                                <div className="flex justify-between mt-1">
                                    <p className="text-xs text-gray-500">Each run ±$800,000 from base 6 runs</p>
                                    {!isInRecommendedRange('runsPerEpisode', state.runsPerEpisode) && (
                                        <p className="text-xs text-yellow-600">Outside recommended range</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Fee per Episode
                                    <span className="text-sm text-gray-500 ml-2">(Recommended: $30k-$60k)</span>
                                </label>
                                <input 
                                    type="number"
                                    min="0"
                                    value={state.feePerEpisode}
                                    onChange={(e) => handleInputChange('feePerEpisode', e.target.value)}
                                    className={`w-full p-3 border rounded-lg input-focus ${
                                        !isInRecommendedRange('feePerEpisode', state.feePerEpisode) 
                                        ? 'border-yellow-400 bg-yellow-50' 
                                        : ''
                                    }`}
                                />
                                <div className="flex justify-between mt-1">
                                    <p className="text-xs text-gray-500">Total episodes: 100</p>
                                    {!isInRecommendedRange('feePerEpisode', state.feePerEpisode) && (
                                        <p className="text-xs text-yellow-600">Outside recommended range</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Schedule (%)</h2>
                        <div className="grid gap-4">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[0, 1, 2, 3, 4, 5].map(year => (
                                    <div key={year} className="relative">
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Year {year}
                                            <span className="text-blue-600 ml-1">({year * 10}% savings)</span>
                                        </label>
                                        <input 
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={state.paymentSchedule[year]}
                                            onChange={(e) => handlePaymentScheduleChange(year, e.target.value)}
                                            className="w-full p-3 border rounded-lg input-focus"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className={`text-sm p-3 rounded-lg ${totalPaymentPercentage === 100 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                Total: {totalPaymentPercentage}% {totalPaymentPercentage !== 100 && '(Must equal 100%)'}
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Results</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Base Revenue:</span>
                                <span className="text-lg font-medium">${state.baseRevenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Runs Adjustment:</span>
                                <span className="text-lg font-medium">${calculateRunsAdjustment().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Total Revenue:</span>
                                <span className="text-lg font-medium">${calculateTotalRevenue().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Licensing Fee:</span>
                                <span className="text-lg font-medium">${calculateLicensingFee().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Payment Savings:</span>
                                <span className="text-lg font-medium">${calculatePaymentSavings().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Net Licensing Fee:</span>
                                <span className="text-lg font-medium">${calculateNetLicensingFee().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 mt-2 bg-blue-50 rounded-lg p-4">
                                <span className="text-blue-800 font-semibold">Final Deal Value:</span>
                                <span className="text-2xl font-bold text-blue-800">${calculateFinalValue().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                renderExplanationContent()
            )}
        </div>
    );
}

ReactDOM.render(<NegotiationCalculator />, document.getElementById('root')); 