import { Building2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";

export const PaymentInfo = () => {
  return (
    <div className="lg:w-1/3 w-full flex flex-col items-stretch">
      <Card shape="xl" className="h-full flex flex-col justify-between overflow-hidden">
        <CardHeader bordered className="text-center">
          <div className="flex items-center justify-center gap-3 text-primary mb-2">
            <Building2 size={24} className="text-primary" />
            <CardTitle>
              Bank Transfer Details
            </CardTitle>
          </div>
          <p className="text-text-muted text-xs leading-relaxed">
            Please make your offline donation or wire transfer directly to our
            foundation bank account.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
          <div className="space-y-4 bg-bg/50 p-6 rounded-2xl border border-border/60 text-xs">
            <div className="space-y-1">
              <p className="text-text-muted uppercase text-[10px] font-bold tracking-wider">
                Account Name
              </p>
              <p className="font-bold text-text text-sm">
                Global Smart Citizens Foundation
              </p>
            </div>

            <Separator className="bg-border/40" />

            <div className="space-y-1">
              <p className="text-text-muted uppercase text-[10px] font-bold tracking-wider">
                Bank Name
              </p>
              <p className="font-bold text-text text-sm">HDFC Bank</p>
            </div>

            <Separator className="bg-border/40" />

            <div className="space-y-1">
              <p className="text-text-muted uppercase text-[10px] font-bold tracking-wider">
                Account Number
              </p>
              <p className="font-bold text-text text-sm tracking-widest">
                50200119596441
              </p>
            </div>

            <Separator className="bg-border/40" />

            <div className="space-y-1">
              <p className="text-text-muted uppercase text-[10px] font-bold tracking-wider">
                IFSC Code
              </p>
              <p className="font-bold text-text text-sm tracking-widest">
                HDFC0000226
              </p>
            </div>
          </div>

          <p className="text-[11px] text-text-light leading-relaxed text-center italic bg-bg p-3.5 rounded-xl border border-border/40">
            Note: All donations to Global Smart Citizens Foundation are eligible
            for tax deduction benefits under Section 80G of the Income Tax Act,
            1961.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
