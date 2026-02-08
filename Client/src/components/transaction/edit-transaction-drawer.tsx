import {
   Drawer,
   DrawerContent,
   DrawerDescription,
   DrawerHeader,
   DrawerTitle,
} from "@/components/ui/drawer";
import TransactionForm from "./transaction-form";
import useEditTransactionDrawer from "@/hook/use-edit-transaction-drawer";

const EditTransactionDrawer = () => {
   const { open, transactionId, onCloseDrawer } =
      useEditTransactionDrawer();
   return (
      <Drawer open={open} onOpenChange={onCloseDrawer} direction="left">
         <DrawerContent className="max-w-md overflow-hidden overflow-y-auto">
            <DrawerHeader>
               <DrawerTitle className="text-xl font-semibold">
                  Edit Transaction
               </DrawerTitle>
               <DrawerDescription>
                  Edit a transaction to track your finances
               </DrawerDescription>
            </DrawerHeader>
            <TransactionForm isEdit={true} transactionId={transactionId}
               onCloseDrawer={onCloseDrawer}
            />
         </DrawerContent>
      </Drawer>
   );
};

export default EditTransactionDrawer;