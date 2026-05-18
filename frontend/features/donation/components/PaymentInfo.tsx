import { QrCode, Building2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export const PaymentInfo = () => {
  return (
    <div className="lg:w-1/3 space-y-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 text-primary mb-2">
            <QrCode size={24} />
            <CardTitle>UPI / QR Code</CardTitle>
          </div>
          <p className="text-text-muted text-[14px]">Scan QR Code using any UPI app to make a quick and secure donation.</p>
        </CardHeader>
        <CardContent className="space-y-8 text-center">
          <div className="aspect-square max-w-[200px] mx-auto bg-bg p-4 rounded-2xl border border-border overflow-hidden">
            <img src="/assets/qr.png" alt="UPI QR Code" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
             {["Paytm", "PhonePe", "GPay", "UPI"].map(tag => (
               <span key={tag} className="text-[11px] font-bold uppercase tracking-widest text-text-light px-2 py-1 bg-bg border border-border rounded-md">{tag}</span>
             ))}
          </div>

          <div className="pt-8 border-t border-border space-y-6 text-left">
            <div className="flex items-center justify-center gap-3 text-primary">
              <Building2 size={24} />
              <CardTitle>Bank Transfer</CardTitle>
            </div>
            <div className="space-y-4 bg-bg p-6 rounded-2xl border border-border text-[14px]">
              <div className="space-y-1">
                <p className="text-text-light uppercase text-[11px] font-bold tracking-wider">Account Name</p>
                <p className="font-bold text-text">Global Smart Citizens Foundation</p>
              </div>
              <div className="space-y-1">
                <p className="text-text-light uppercase text-[11px] font-bold tracking-wider">Bank</p>
                <p className="font-bold text-text">HDFC Bank</p>
              </div>
              <div className="space-y-1">
                <p className="text-text-light uppercase text-[11px] font-bold tracking-wider">Account Number</p>
                <p className="font-bold text-text tracking-widest">50200119596441</p>
              </div>
              <div className="space-y-1">
                <p className="text-text-light uppercase text-[11px] font-bold tracking-wider">IFSC Code</p>
                <p className="font-bold text-text tracking-widest">HDFC0000226</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
