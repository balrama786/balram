/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/elements/ui/tooltip";
import { useGetRecentChatsQuery, useTogglePinChatMutation } from "@/src/redux/api/chatApi";
import { useGetWabaPhoneNumbersQuery } from "@/src/redux/api/whatsappApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { rehydrateChat, selectChat, selSelectPhoneNumber, setLeftSidebartoggle } from "@/src/redux/reducers/messenger/chatSlice";
import { RootState } from "@/src/redux/store";
import { RecentChatResponseItem } from "@/src/types/components/chat";
import { getInitials } from "@/src/utils";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useNotifications } from "@/src/utils/hooks/useNotifications";
import { maskSensitiveData } from "@/src/utils/masking";
import { BellRing, Filter, Pin, Search, X } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ChatFilterModal from "./ChatFilterModal";
import { ChatSidebarSkeleton } from "./ChatSkeleton";

const ChatSidebar = () => {
  const dispatch = useAppDispatch();
  const { selectedPhoneNumberId, selectedChat, isRehydrated, isMobileScreen } = useAppSelector((state: RootState) => state.chat);
  const { app_name } = useAppSelector((state: RootState) => state.setting);
  const { user } = useAppSelector((state) => state.auth);
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const selectedWabaId = selectedWorkspace?.waba_id;
  const isAgent = user?.role === "agent";
  const selectedChatId = selectedChat?.contact.id;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [activeTab, setActiveTab] = useState("all");
  const { permission, requestPermission } = useNotifications();
  const searchParams = useSearchParams();
  const contactIdFromQuery = searchParams.get("contact_id");

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ startDate?: string; endDate?: string; tagLabel?: string; hasNotes?: boolean; agentId?: string }>({});
  const activeFilterCount = Object.keys(filters).length;

  const { data: phoneNumbersData, isLoading: isLoadingPhones } = useGetWabaPhoneNumbersQuery(selectedWabaId || "", { skip: !selectedWabaId });

  const phoneNumbers = useMemo(() => {
    const list = (phoneNumbersData as any)?.data || [];
    return list;
  }, [phoneNumbersData]);

  useEffect(() => {
    dispatch(rehydrateChat());
  }, [dispatch]);

  useEffect(() => {
    if (isRehydrated && phoneNumbers.length > 0) {
      if (!selectedPhoneNumberId || !phoneNumbers.find((p: any) => String(p.id) === String(selectedPhoneNumberId))) {
        const firstId = String(phoneNumbers[0].id);
        dispatch(selSelectPhoneNumber(firstId));
      }
    }
  }, [phoneNumbers, selectedPhoneNumberId, dispatch, isRehydrated, selectedWabaId]);

  const { data: chatsData, isLoading } = useGetRecentChatsQuery(
    {
      search: debouncedSearch || undefined,
      whatsapp_phone_number_id: selectedPhoneNumberId || undefined,
      start_date: filters.startDate,
      end_date: filters.endDate,
      tags: filters.tagLabel,
      has_notes: filters.hasNotes,
      agent_id: filters.agentId,
      last_message_read: activeTab === "unread" ? false : undefined,
      is_assigned: activeTab === "assigned" ? true : activeTab === "unassigned" ? false : undefined,
    },
    {
      skip: !selectedPhoneNumberId,
    }
  );

  const [togglePinChat] = useTogglePinChatMutation();

  const sortedChats = useMemo(() => {
    if (!chatsData?.data) return [];

    return [...chatsData.data].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;

      const dateA = new Date(a.lastMessage.createdAt).getTime();
      const dateB = new Date(b.lastMessage.createdAt).getTime();
      return dateB - dateA;
    });
  }, [chatsData]);

  useEffect(() => {
    if (contactIdFromQuery && sortedChats.length > 0 && isRehydrated) {
      const targetChat = sortedChats.find((c) => c.contact.id === contactIdFromQuery);
      if (targetChat && selectedChatId !== contactIdFromQuery) {
        handleSelectChat(targetChat);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactIdFromQuery, sortedChats, isRehydrated]);

  const handleTogglePin = async (e: React.MouseEvent, chat: RecentChatResponseItem) => {
    e.stopPropagation();
    try {
      await togglePinChat({
        contact_id: chat.contact.id,
        phone_number: chat.contact.number,
      }).unwrap();
    } catch (error) {
      console.error("Failed to toggle pin chat:", error);
    }
  };

  const handleSelectChat = (chat: RecentChatResponseItem) => {
    dispatch(selectChat(chat));
    if (window.innerWidth <= 991) {
      dispatch(
        setLeftSidebartoggle({
          isMobile: true,
          forceState: false,
        })
      );
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    dispatch(selSelectPhoneNumber(value));
  };

  const handleSidebar = () => {
    dispatch(
      setLeftSidebartoggle({
        isMobile: window.innerWidth <= 991,
      })
    );
  };

  return (
    <div className="[@media(max-width:1024px)]:z-50 w-full max-w-[320px] sm:min-w-[320px] sm:max-w-[320px] border rounded-lg border-gray-100 dark:border-(--card-border-color) flex flex-col bg-white dark:bg-(--card-color)   [@media(max-width:639px)]:left-0! [@media(max-width:639px)]:h-[calc(100vh-107px)]!  [@media(max-width:991px)]:absolute [@media(max-width:991px)]:bg-white dark:[@media(max-width:991px)]:bg-(--page-body-bg) [@media(max-width:991px)]:left-0 [@media(max-width:991px)]:h-[calc(100vh-82px-16px-16px)]">
      <div className="p-4 pb-0 border-b border-gray-200 dark:border-(--card-border-color) space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Chats</h2>
          <div className="flex gap-2">
            {permission === "default" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={requestPermission} variant="ghost" size="icon" className="h-8 w-8 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg text-amber-600 hover:text-amber-700 animate-pulse transition-all">
                    <BellRing size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-primary/80">
                  <p>Enable desktop notifications to receive chat notifications</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isMobileScreen && (
              <Button onClick={handleSidebar} variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-lg">
                <X size={18} className="text-slate-600 dark:text-gray-500" />
              </Button>
            )}
          </div>
        </div>

        {!isRehydrated ? (
          <div className="w-full h-10 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg" />
        ) : (
          <Select value={selectedPhoneNumberId?.toString() || ""} onValueChange={handlePhoneNumberChange}>
            <SelectTrigger className="w-full h-8 bg-(--input-color) dark:border-none dark:bg-(--page-body-bg) dark:hover:bg-(--page-body-bg) border dark:border-(--card-border-color) rounded-lg focus:ring-0 dark:[@media(max-width:991px)]:bg-(--card-color) dark:hover:[@media(max-width:991px)]:bg-(--card-color)">
              <SelectValue>{selectedPhoneNumberId ? maskSensitiveData(phoneNumbers.find((p: any) => String(p.id) === String(selectedPhoneNumberId))?.display_phone_number || phoneNumbers.find((p: any) => String(p.id) === String(selectedPhoneNumberId))?.phone_number || "", "phone", is_demo_mode) : isLoadingPhones ? "Loading numbers..." : "Select Phone Number"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {phoneNumbers.map((phone: any, index: number) => (
                <SelectItem className="dark:bg-(--page-body-bg)" key={index} value={String(phone.id)}>
                  {maskSensitiveData(phone.display_phone_number, "phone", is_demo_mode) || maskSensitiveData(phone.phone_number, "phone", is_demo_mode) || "Unknown Number"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-2">
          <div className="relative group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors" size={16} />
            <Input placeholder="Search interactions" className="pl-10 bg-(--input-color) border dark:bg-(--page-body-bg) h-9 rounded-lg focus-visible:ring-1 focus-visible:ring-emerald-500 transition-all font-medium dark:[@media(max-width:991px)]:bg-(--card-color) dark:hover:[@media(max-width:991px)]:bg-(--card-color)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsFilterModalOpen(true)} className={`h-9 w-9 rounded-lg border border-transparent ${activeFilterCount > 0 ? "bg-emerald-100 text-primary dark:bg-emerald-900/30 dark:text-primary" : "bg-slate-50 text-slate-500 dark:bg-(--page-body-bg) dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-(--table-hover)"}`}>
            <div className="relative">
              <Filter size={16} />
              {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 h-3 w-3 bg-emerald-500 rounded-full border border-white dark:border-neutral-900" />}
            </div>
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto py-1.5 no-scrollbar table-custom-scrollbar">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "active", label: "Active" },
            { id: "assigned", label: "Assigned" },
            { id: "unassigned", label: "Unassigned" },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-0! h-8! rounded-full text-xs font-bold transition-all whitespace-nowrap
                ${activeTab === tab.id ? "bg-primary text-white shadow-sm" : "bg-slate-100 text-slate-500 dark:bg-(--page-body-bg) dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-(--table-hover)"}
              `}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-2">
        {isLoading ? (
          <ChatSidebarSkeleton />
        ) : sortedChats.length === 0 ? (
          <div className="text-center p-8 dark:text-gray-400 text-slate-500 text-sm flex flex-col items-center gap-2">
            <span className="p-3 bg-slate-50 dark:bg-(--page-body-bg) rounded-full">
              <Search size={20} className="text-slate-400" />
            </span>
            <p>No chats found</p>
          </div>
        ) : (
          sortedChats.map((chat: RecentChatResponseItem, index: number) => {
            const contact = chat.contact;
            const lastMessage = chat.lastMessage;
            let parsed;
            if (lastMessage.messageType == "location" && lastMessage.content) {
              try {
                parsed = JSON.parse(lastMessage.content);
              } catch (e) {
                console.error("Failed to parse location content", e);
              }
            }

            return (
              <div
                key={index}
                onClick={() => handleSelectChat(chat)}
                className={`
                group p-2 cursor-pointer rounded-lg transition-all border-l hover:bg-slate-50 dark:hover:bg-(--table-hover) dark:bg-(--page-body-bg) dark:[@media(max-width:991px)]:bg-(--card-color) relative
                ${selectedChatId === contact.id ? "bg-(--light-primary) dark:bg-(--dark-body) border-primary" : "border-transparent bg-gray-50"}
              `}
              >
                <div
                  onClick={(e) => handleTogglePin(e, chat)}
                  className={`absolute right-2 top-2 z-10 p-1.5 rounded-md transition-all 
                  ${chat.is_pinned ? "text-primary opacity-100 flex" : "text-slate-400 opacity-0 group-hover:opacity-100 hidden group-hover:flex hover:bg-slate-100 dark:hover:bg-(--dark-body)"}`}
                >
                  <Pin size={14} className={chat.is_pinned ? "fill-primary" : ""} />
                </div>

                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border border-slate-100 dark:border-(--card-border-color) overflow-hidden">{contact.avatar ? <Image src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" width={48} height={48} unoptimized /> : getInitials(app_name || "")}</div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 ml-0">
                    <div className="flex justify-between items-center pr-6">
                      <div className="flex items-center gap-2 truncate">
                        <h3 className={`font-semibold truncate text-sm ${selectedChatId === contact.id ? "text-primary" : "text-slate-900 dark:text-white"}`}>{isAgent && user?.is_phoneno_hide ? "Customer" : maskSensitiveData(contact.number, "phone", is_demo_mode)}</h3>
                        {contact.chat_status === "resolved" && <Badge className="h-4 px-1.5 text-[8px] bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-bold uppercase tracking-tighter">Resolved</Badge>}
                      </div>
                      <span className={`text-[11px] pr-2 whitespace-nowrap ${lastMessage.unreadCount ? "text-emerald-600 font-bold" : "text-slate-500 dark:text-gray-400"}`}>{lastMessage.createdAt ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-xs truncate max-w-45 ${lastMessage.unreadCount ? "text-slate-900 dark:text-white font-medium" : "text-slate-500 dark:text-gray-500"}`}>{lastMessage.messageType == "location" ? parsed?.address : lastMessage?.content || "No messages yet"}</p>
                    </div>
                  </div>
                </div>
                {contact.labels && contact.labels.length > 0 && (
                  <div className="flex mt-3 ml-2 gap-2 flex-wrap">
                    {contact.labels.map((label, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="py-1 px-2.5 rounded-lg border-rose-100 bg-rose-50 text-rose-500 font-medium flex items-center gap-1.5"
                        style={
                          label.color
                            ? {
                                backgroundColor: `${label.color}15`,
                                color: label.color,
                                borderColor: label.color,
                              }
                            : undefined
                        }
                      >
                        {label.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <ChatFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={setFilters} initialFilters={filters} />
    </div>
  );
};

export default ChatSidebar;
