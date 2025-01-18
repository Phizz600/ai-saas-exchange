import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion, AnimatePresence } from "framer-motion";

export const LiveChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4"
          >
            <Card className="w-[300px] p-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Live Support</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our support team typically replies in a few minutes.
                </p>
                <div className="h-[300px] bg-accent/5 rounded-md p-4 overflow-y-auto">
                  <div className="flex flex-col space-y-2">
                    <div className="bg-primary/10 p-2 rounded-lg max-w-[80%] self-start">
                      <p className="text-sm">Hello! How can we help you today?</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="w-16 h-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.25)] bg-gradient-to-r from-[#D946EF] via-[#8B5CF6] to-[#0EA4E9] hover:opacity-90 transition-all duration-300"
      >
        <MessageCircle className="h-8 w-8" />
      </Button>
    </div>
  );
};