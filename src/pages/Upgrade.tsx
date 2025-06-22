import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";

const UpgradePage = () => {
    const navigate = useNavigate();

    const features = [
        "Unlimited AI Quote Generation",
        "Advanced Customer Analytics",
        "Priority Support",
        "Automated Follow-ups",
        "Team Collaboration Tools",
        "Custom Branding on Quotes"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex justify-center items-center">
            <div className="w-full max-w-4xl">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 glass-button">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Card className="p-8 glass text-center">
                    <h1 className="text-4xl font-bold gradient-text mb-4">Upgrade to Pro</h1>
                    <p className="text-lg text-gray-600 mb-8">Unlock powerful features to grow your business.</p>
                    
                    <div className="grid md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-8">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center">
                                <Check className="w-5 h-5 text-green-500 mr-3" />
                                <span className="text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-5xl font-bold text-gray-900 mb-2">
                        $49<span className="text-xl font-normal text-gray-500">/month</span>
                    </p>
                    <p className="text-gray-500 mb-8">Billed annually, or $59 billed monthly.</p>

                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white w-full max-w-xs mx-auto text-lg">
                        Upgrade Now
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default UpgradePage; 