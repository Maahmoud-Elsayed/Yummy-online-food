import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ActionsProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  title: string;
  description: string;
  cancel: string;
};

const TableAction = ({
  open,
  setOpen,
  children,
  title,
  description,
  cancel,
}: ActionsProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="py-2">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {cancel}
          </Button>
          {children}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableAction;
