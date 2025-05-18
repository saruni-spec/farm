import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface FarmReportData {
  farmName: string;
  area?: string;
  generatedDate: string;
  aspects: ReportAspect[];
}

interface ReportAspect {
  id: string;
  title: string;
  value: string;
  unit?: string;
  description?: string;
  icon?: React.ReactNode;
  colorClass?: string;
}

const ReportCard = ({
  isReportDialogOpen,
  setIsReportDialogOpen,
  currentReportData,
}: {
  isReportDialogOpen: boolean;
  setIsReportDialogOpen: (open: boolean) => void;
  currentReportData: FarmReportData | null;
}) => {
  return (
    <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
      <DialogContent className="z-[9999] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-0">
        {currentReportData && (
          <>
            <DialogHeader className="p-6 pb-4 bg-slate-50 rounded-t-lg">
              <DialogTitle className="text-2xl">
                Analysis Report: {currentReportData.farmName}
              </DialogTitle>
              <DialogDescription>
                Generated on: {currentReportData.generatedDate}
                {currentReportData.area && ` | Area: ${currentReportData.area}`}
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              {currentReportData.aspects.map((aspect) => (
                <div
                  key={aspect.id}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-md font-semibold text-gray-800">
                        {aspect.title}
                      </h3>
                      {aspect.icon && (
                        <div className="p-2 bg-gray-100 rounded-full">
                          {aspect.icon}
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-3xl font-bold ${
                        aspect.colorClass || "text-black"
                      }`}
                    >
                      {aspect.value}
                      {aspect.unit && (
                        <span className="text-xl ml-1">{aspect.unit}</span>
                      )}
                    </p>
                    {aspect.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {aspect.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          aspect.colorClass
                            ? aspect.colorClass.replace("text-", "bg-")
                            : "bg-gray-500"
                        }`}
                        style={{ width: `${parseInt(aspect.value) || 50}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {currentReportData.aspects.length === 0 && (
                <p className="col-span-full text-center text-gray-500">
                  No analysis aspects available for this report.
                </p>
              )}
            </div>

            <DialogFooter className="p-6 pt-4 border-t bg-slate-50 rounded-b-lg">
              <Button
                variant="outline"
                onClick={() => setIsReportDialogOpen(false)}
              >
                <X size={16} className="mr-2" /> Close Report
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportCard;
