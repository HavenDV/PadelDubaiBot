Title: Telegram Bot API

URL Source: https://core.telegram.org/bots/api

Markdown Content:
> The Bot API is an HTTP-based interface created for developers keen on building bots for Telegram.
> 
> To learn how to create and set up a bot, please consult our [**Introduction to Bots**](https://core.telegram.org/bots) and [**Bot FAQ**](https://core.telegram.org/bots/faq).

### [](https://core.telegram.org/bots/api#recent-changes)Recent changes

> Subscribe to [@BotNews](https://t.me/botnews) to be the first to know about the latest updates and join the discussion in [@BotTalk](https://t.me/bottalk)

#### [](https://core.telegram.org/bots/api#august-15-2025)August 15, 2025

**Bot API 9.2**

**Checklists**

*   Added the field _checklist\_task\_id_ to the class [ReplyParameters](https://core.telegram.org/bots/api#replyparameters), allowing bots to reply to a specific checklist task.
*   Added the field _reply\_to\_checklist\_task\_id_ to the class [Message](https://core.telegram.org/bots/api#message).

**Gifts**

*   Added the field _publisher\_chat_ to the classes [Gift](https://core.telegram.org/bots/api#gift) and [UniqueGift](https://core.telegram.org/bots/api#uniquegift) which can be used to get information about the chat that published a gift.

**Direct Messages in Channels**

*   Added the field _is\_direct\_messages_ to the classes [Chat](https://core.telegram.org/bots/api#chat) and [ChatFullInfo](https://core.telegram.org/bots/api#chatfullinfo) which can be used to identify supergroups that are used as channel direct messages chats.
*   Added the field _parent\_chat_ to the class [ChatFullInfo](https://core.telegram.org/bots/api#chatfullinfo) which indicates the parent channel chat for a channel direct messages chat.
*   Added the class [DirectMessagesTopic](https://core.telegram.org/bots/api#directmessagestopic) and the field _direct\_messages\_topic_ to the class [Message](https://core.telegram.org/bots/api#message), describing a topic of a direct messages chat.
*   Added the parameter _direct\_messages\_topic\_id_ to the methods [sendMessage](https://core.telegram.org/bots/api#sendmessage), [sendPhoto](https://core.telegram.org/bots/api#sendphoto), [sendVideo](https://core.telegram.org/bots/api#sendvideo), [sendAnimation](https://core.telegram.org/bots/api#sendanimation), [sendAudio](https://core.telegram.org/bots/api#sendaudio), [sendDocument](https://core.telegram.org/bots/api#senddocument), [sendPaidMedia](https://core.telegram.org/bots/api#sendpaidmedia), [sendSticker](https://core.telegram.org/bots/api#sendsticker), [sendVideoNote](https://core.telegram.org/bots/api#sendvideonote), [sendVoice](https://core.telegram.org/bots/api#sendvoice), [sendLocation](https://core.telegram.org/bots/api#sendlocation), [sendVenue](https://core.telegram.org/bots/api#sendvenue), [sendContact](https://core.telegram.org/bots/api#sendcontact), [sendDice](https://core.telegram.org/bots/api#senddice), [sendInvoice](https://core.telegram.org/bots/api#sendinvoice), [sendMediaGroup](https://core.telegram.org/bots/api#sendmediagroup), [copyMessage](https://core.telegram.org/bots/api#copymessage), [copyMessages](https://core.telegram.org/bots/api#copymessages), [forwardMessage](https://core.telegram.org/bots/api#forwardmessage) and [forwardMessages](https://core.telegram.org/bots/api#forwardmessages). This parameter can be used to send a message to a direct messages chat topic.

**Suggested Posts**

*   Added the class [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) and the parameter _suggested\_post\_parameters_ to the methods [sendMessage](https://core.telegram.org/bots/api#sendmessage), [sendPhoto](https://core.telegram.org/bots/api#sendphoto), [sendVideo](https://core.telegram.org/bots/api#sendvideo), [sendAnimation](https://core.telegram.org/bots/api#sendanimation), [sendAudio](https://core.telegram.org/bots/api#sendaudio), [sendDocument](https://core.telegram.org/bots/api#senddocument), [sendPaidMedia](https://core.telegram.org/bots/api#sendpaidmedia), [sendSticker](https://core.telegram.org/bots/api#sendsticker), [sendVideoNote](https://core.telegram.org/bots/api#sendvideonote), [sendVoice](https://core.telegram.org/bots/api#sendvoice), [sendLocation](https://core.telegram.org/bots/api#sendlocation), [sendVenue](https://core.telegram.org/bots/api#sendvenue), [sendContact](https://core.telegram.org/bots/api#sendcontact), [sendDice](https://core.telegram.org/bots/api#senddice), [sendInvoice](https://core.telegram.org/bots/api#sendinvoice), [copyMessage](https://core.telegram.org/bots/api#copymessage), [forwardMessage](https://core.telegram.org/bots/api#forwardmessage). This parameter can be used to send a suggested post to a direct messages chat topic.
*   Added the method [approveSuggestedPost](https://core.telegram.org/bots/api#approvesuggestedpost), allowing bots to approve incoming suggested posts.
*   Added the method [declineSuggestedPost](https://core.telegram.org/bots/api#declinesuggestedpost), allowing bots to decline incoming suggested posts.
*   Added the field _can\_manage\_direct\_messages_ to the classes [ChatMemberAdministrator](https://core.telegram.org/bots/api#chatmemberadministrator) and [ChatAdministratorRights](https://core.telegram.org/bots/api#chatadministratorrights).
*   Added the parameter _can\_manage\_direct\_messages_ to the method [promoteChatMember](https://core.telegram.org/bots/api#promotechatmember).
*   Added the field _is\_paid\_post_ to the class [Message](https://core.telegram.org/bots/api#message), which can be used to identify paid posts. Such posts must not be deleted for 24 hours to receive the payment.
*   Added the class [SuggestedPostPrice](https://core.telegram.org/bots/api#suggestedpostprice), describing the price of a suggested post.
*   Added the class [SuggestedPostInfo](https://core.telegram.org/bots/api#suggestedpostinfo) and the field _suggested\_post\_info_ to the class [Message](https://core.telegram.org/bots/api#message), describing a suggested post.
*   Added the class [SuggestedPostApproved](https://core.telegram.org/bots/api#suggestedpostapproved) and the field _suggested\_post\_approved_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about the approval of a suggested post.
*   Added the class [SuggestedPostApprovalFailed](https://core.telegram.org/bots/api#suggestedpostapprovalfailed) and the field _suggested\_post\_approval\_failed_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about the failed approval of a suggested post.
*   Added the class [SuggestedPostDeclined](https://core.telegram.org/bots/api#suggestedpostdeclined) and the field _suggested\_post\_declined_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about the rejection of a suggested post.
*   Added the class [SuggestedPostPaid](https://core.telegram.org/bots/api#suggestedpostpaid) and the field _suggested\_post\_paid_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about a successful payment for a suggested post.
*   Added the class [SuggestedPostRefunded](https://core.telegram.org/bots/api#suggestedpostrefunded) and the field _suggested\_post\_refunded_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about a payment refund for a suggested post.

#### [](https://core.telegram.org/bots/api#july-3-2025)July 3, 2025

**Bot API 9.1**

**Checklists**

*   Added the class [ChecklistTask](https://core.telegram.org/bots/api#checklisttask) representing a task in a checklist.
*   Added the class [Checklist](https://core.telegram.org/bots/api#checklist) representing a checklist.
*   Added the class [InputChecklistTask](https://core.telegram.org/bots/api#inputchecklisttask) representing a task to add to a checklist.
*   Added the class [InputChecklist](https://core.telegram.org/bots/api#inputchecklist) representing a checklist to create.
*   Added the field _checklist_ to the classes [Message](https://core.telegram.org/bots/api#message) and [ExternalReplyInfo](https://core.telegram.org/bots/api#externalreplyinfo), describing a checklist in a message.
*   Added the class [ChecklistTasksDone](https://core.telegram.org/bots/api#checklisttasksdone) and the field _checklist\_tasks\_done_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about status changes for tasks in a checklist (i.e., marked as done/not done).
*   Added the class [ChecklistTasksAdded](https://core.telegram.org/bots/api#checklisttasksadded) and the field _checklist\_tasks\_added_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about the addition of new tasks to a checklist.
*   Added the method [sendChecklist](https://core.telegram.org/bots/api#sendchecklist), allowing bots to send a checklist on behalf of a business account.
*   Added the method [editMessageChecklist](https://core.telegram.org/bots/api#editmessagechecklist), allowing bots to edit a checklist on behalf of a business account.

**Gifts**

*   Added the field _next\_transfer\_date_ to the classes [OwnedGiftUnique](https://core.telegram.org/bots/api#ownedgiftunique) and [UniqueGiftInfo](https://core.telegram.org/bots/api#uniquegiftinfo).
*   Added the field _last\_resale\_star\_count_ to the class [UniqueGiftInfo](https://core.telegram.org/bots/api#uniquegiftinfo).
*   Added “resale” as the possible value of the field _origin_ in the class [UniqueGiftInfo](https://core.telegram.org/bots/api#uniquegiftinfo).

**General**

*   Increased the maximum number of options in a poll to 12.
*   Added the method [getMyStarBalance](https://core.telegram.org/bots/api#getmystarbalance), allowing bots to get their current balance of Telegram Stars.
*   Added the class [DirectMessagePriceChanged](https://core.telegram.org/bots/api#directmessagepricechanged) and the field _direct\_message\_price\_changed_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about a price change for direct messages sent to the channel chat.
*   Added the method _hideKeyboard_ to the class [WebApp](https://core.telegram.org/bots/webapps#initializing-mini-apps).

#### [](https://core.telegram.org/bots/api#april-11-2025)April 11, 2025

**Bot API 9.0**

**Business Accounts**

*   Added the class [BusinessBotRights](https://core.telegram.org/bots/api#businessbotrights) and replaced the field _can\_reply_ with the field _rights_ of the type [BusinessBotRights](https://core.telegram.org/bots/api#businessbotrights) in the class [BusinessConnection](https://core.telegram.org/bots/api#businessconnection).
*   Added the method [readBusinessMessage](https://core.telegram.org/bots/api#readbusinessmessage), allowing bots to mark incoming messages as read on behalf of a business account.
*   Added the method [deleteBusinessMessages](https://core.telegram.org/bots/api#deletebusinessmessages), allowing bots to delete messages on behalf of a business account.
*   Added the method [setBusinessAccountName](https://core.telegram.org/bots/api#setbusinessaccountname), allowing bots to change the first and last name of a managed business account.
*   Added the method [setBusinessAccountUsername](https://core.telegram.org/bots/api#setbusinessaccountusername), allowing bots to change the username of a managed business account.
*   Added the method [setBusinessAccountBio](https://core.telegram.org/bots/api#setbusinessaccountbio), allowing bots to change the bio of a managed business account.
*   Added the class [InputProfilePhoto](https://core.telegram.org/bots/api#inputprofilephoto), describing a profile photo to be set.
*   Added the methods [setBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#setbusinessaccountprofilephoto) and [removeBusinessAccountProfilePhoto](https://core.telegram.org/bots/api#removebusinessaccountprofilephoto), allowing bots to change the profile photo of a managed business account.
*   Added the method [setBusinessAccountGiftSettings](https://core.telegram.org/bots/api#setbusinessaccountgiftsettings), allowing bots to change the privacy settings pertaining to incoming gifts in a managed business account.
*   Added the class [StarAmount](https://core.telegram.org/bots/api#staramount) and the method [getBusinessAccountStarBalance](https://core.telegram.org/bots/api#getbusinessaccountstarbalance), allowing bots to check the current Telegram Star balance of a managed business account.
*   Added the method [transferBusinessAccountStars](https://core.telegram.org/bots/api#transferbusinessaccountstars), allowing bots to transfer Telegram Stars from the balance of a managed business account to their own balance for withdrawal.
*   Added the classes [OwnedGiftRegular](https://core.telegram.org/bots/api#ownedgiftregular), [OwnedGiftUnique](https://core.telegram.org/bots/api#ownedgiftunique), [OwnedGifts](https://core.telegram.org/bots/api#ownedgifts) and the method [getBusinessAccountGifts](https://core.telegram.org/bots/api#getbusinessaccountgifts), allowing bots to fetch the list of gifts owned by a managed business account.
*   Added the method [convertGiftToStars](https://core.telegram.org/bots/api#convertgifttostars), allowing bots to convert gifts received by a managed business account to Telegram Stars.
*   Added the method [upgradeGift](https://core.telegram.org/bots/api#upgradegift), allowing bots to upgrade regular gifts received by a managed business account to unique gifts.
*   Added the method [transferGift](https://core.telegram.org/bots/api#transfergift), allowing bots to transfer unique gifts owned by a managed business account.
*   Added the classes [InputStoryContentPhoto](https://core.telegram.org/bots/api#inputstorycontentphoto) and [InputStoryContentVideo](https://core.telegram.org/bots/api#inputstorycontentvideo) representing the content of a story to post.
*   Added the classes [StoryArea](https://core.telegram.org/bots/api#storyarea), [StoryAreaPosition](https://core.telegram.org/bots/api#storyareaposition), [LocationAddress](https://core.telegram.org/bots/api#locationaddress), [StoryAreaTypeLocation](https://core.telegram.org/bots/api#storyareatypelocation), [StoryAreaTypeSuggestedReaction](https://core.telegram.org/bots/api#storyareatypesuggestedreaction), [StoryAreaTypeLink](https://core.telegram.org/bots/api#storyareatypelink), [StoryAreaTypeWeather](https://core.telegram.org/bots/api#storyareatypeweather) and [StoryAreaTypeUniqueGift](https://core.telegram.org/bots/api#storyareatypeuniquegift), describing clickable active areas on stories.
*   Added the method [postStory](https://core.telegram.org/bots/api#poststory), allowing bots to post a story on behalf of a managed business account.
*   Added the method [editStory](https://core.telegram.org/bots/api#editstory), allowing bots to edit stories they had previously posted on behalf of a managed business account.
*   Added the method [deleteStory](https://core.telegram.org/bots/api#deletestory), allowing bots to delete stories they had previously posted on behalf of a managed business account.

**Mini Apps**

*   Added the field [DeviceStorage](https://core.telegram.org/bots/webapps#devicestorage), allowing Mini Apps to use persistent local storage on the user's device.
*   Added the field [SecureStorage](https://core.telegram.org/bots/webapps#securestorage), allowing Mini Apps to use a secure local storage on the user's device for sensitive data.

**Gifts**

*   Added the classes [UniqueGiftModel](https://core.telegram.org/bots/api#uniquegiftmodel), [UniqueGiftSymbol](https://core.telegram.org/bots/api#uniquegiftsymbol), [UniqueGiftBackdropColors](https://core.telegram.org/bots/api#uniquegiftbackdropcolors), and [UniqueGiftBackdrop](https://core.telegram.org/bots/api#uniquegiftbackdrop) to describe the properties of a unique gift.
*   Added the class [UniqueGift](https://core.telegram.org/bots/api#uniquegift) describing a gift that was upgraded to a unique one.
*   Added the class [AcceptedGiftTypes](https://core.telegram.org/bots/api#acceptedgifttypes) describing the types of gifts that are accepted by a user or a chat.
*   Replaced the field _can\_send\_gift_ with the field _accepted\_gift\_types_ of the type [AcceptedGiftTypes](https://core.telegram.org/bots/api#acceptedgifttypes) in the class [ChatFullInfo](https://core.telegram.org/bots/api#chatfullinfo).
*   Added the class [GiftInfo](https://core.telegram.org/bots/api#giftinfo) and the field _gift_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about a regular gift that was sent or received.
*   Added the class [UniqueGiftInfo](https://core.telegram.org/bots/api#uniquegiftinfo) and the field _unique\_gift_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about a unique gift that was sent or received.

**Telegram Premium**

*   Added the method [giftPremiumSubscription](https://core.telegram.org/bots/api#giftpremiumsubscription), allowing bots to gift a user a Telegram Premium subscription paid in Telegram Stars.
*   Added the field _premium\_subscription\_duration_ to the class [TransactionPartnerUser](https://core.telegram.org/bots/api#transactionpartneruser) for transactions involving a Telegram Premium subscription purchased by the bot.
*   Added the field _transaction\_type_ to the class [TransactionPartnerUser](https://core.telegram.org/bots/api#transactionpartneruser), simplifying the differentiation and processing of all transaction types.

**General**

*   Increased the maximum price for paid media to 10000 Telegram Stars.
*   Increased the maximum price for a subscription period to 10000 Telegram Stars.
*   Added the class [PaidMessagePriceChanged](https://core.telegram.org/bots/api#paidmessagepricechanged) and the field _paid\_message\_price\_changed_ to the class [Message](https://core.telegram.org/bots/api#message), describing a service message about a price change for paid messages sent to the chat.
*   Added the field _paid\_star\_count_ to the class [Message](https://core.telegram.org/bots/api#message), containing the number of [Telegram Stars](https://telegram.org/blog/telegram-stars) that were paid to send the message.

**[See earlier changes »](https://core.telegram.org/bots/api-changelog)**

### [](https://core.telegram.org/bots/api#authorizing-your-bot)Authorizing your bot

Each bot is given a unique authentication token [when it is created](https://core.telegram.org/bots/features#botfather). The token looks something like `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`, but we'll use simply **<token>** in this document instead. You can learn about obtaining tokens and generating new ones in [this document](https://core.telegram.org/bots/features#botfather).

### [](https://core.telegram.org/bots/api#making-requests)Making requests

All queries to the Telegram Bot API must be served over HTTPS and need to be presented in this form: `https://api.telegram.org/bot<token>/METHOD_NAME`. Like this for example:

`https://api.telegram.org/bot123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11/getMe`
We support **GET** and **POST** HTTP methods. We support four ways of passing parameters in Bot API requests:

*   [URL query string](https://en.wikipedia.org/wiki/Query_string)
*   application/x-www-form-urlencoded
*   application/json (except for uploading files)
*   multipart/form-data (use to upload files)

The response contains a JSON object, which always has a Boolean field 'ok' and may have an optional String field 'description' with a human-readable description of the result. If 'ok' equals _True_, the request was successful and the result of the query can be found in the 'result' field. In case of an unsuccessful request, 'ok' equals false and the error is explained in the 'description'. An Integer 'error_code' field is also returned, but its contents are subject to change in the future. Some errors may also have an optional field 'parameters' of the type [ResponseParameters](https://core.telegram.org/bots/api#responseparameters), which can help to automatically handle the error.

*   All methods in the Bot API are case-insensitive.
*   All queries must be made using UTF-8.

#### [](https://core.telegram.org/bots/api#making-requests-when-getting-updates)Making requests when getting updates

If you're using [**webhooks**](https://core.telegram.org/bots/api#getting-updates), you can perform a request to the Bot API while sending an answer to the webhook. Use either _application/json_ or _application/x-www-form-urlencoded_ or _multipart/form-data_ response content type for passing parameters. Specify the method to be invoked in the _method_ parameter of the request. It's not possible to know that such a request was successful or get its result.

> Please see our [FAQ](https://core.telegram.org/bots/faq#how-can-i-make-requests-in-response-to-updates) for examples.

### [](https://core.telegram.org/bots/api#using-a-local-bot-api-server)Using a Local Bot API Server

The Bot API server source code is available at [telegram-bot-api](https://github.com/tdlib/telegram-bot-api). You can run it locally and send the requests to your own server instead of `https://api.telegram.org`. If you switch to a local Bot API server, your bot will be able to:

*   Download files without a size limit.
*   Upload files up to 2000 MB.
*   Upload files using their local path and [the file URI scheme](https://en.wikipedia.org/wiki/File_URI_scheme).
*   Use an HTTP URL for the webhook.
*   Use any local IP address for the webhook.
*   Use any port for the webhook.
*   Set _max\_webhook\_connections_ up to 100000.
*   Receive the absolute local path as a value of the _file\_path_ field without the need to download the file after a [getFile](https://core.telegram.org/bots/api#getfile) request.

#### [](https://core.telegram.org/bots/api#do-i-need-a-local-bot-api-server)Do I need a Local Bot API Server

The majority of bots will be OK with the default configuration, running on our servers. But if you feel that you need one of [these features](https://core.telegram.org/bots/api#using-a-local-bot-api-server), you're welcome to switch to your own at any time.

### [](https://core.telegram.org/bots/api#getting-updates)Getting updates

There are two mutually exclusive ways of receiving updates for your bot - the [getUpdates](https://core.telegram.org/bots/api#getupdates) method on one hand and [webhooks](https://core.telegram.org/bots/api#setwebhook) on the other. Incoming updates are stored on the server until the bot receives them either way, but they will not be kept longer than 24 hours.

Regardless of which option you choose, you will receive JSON-serialized [Update](https://core.telegram.org/bots/api#update) objects as a result.

#### [](https://core.telegram.org/bots/api#update)Update

This [object](https://core.telegram.org/bots/api#available-types) represents an incoming update.

At most **one** of the optional parameters can be present in any given update.

| Field | Type | Description |
| --- | --- | --- |
| update_id | Integer | The update's unique identifier. Update identifiers start from a certain positive number and increase sequentially. This identifier becomes especially handy if you're using [webhooks](https://core.telegram.org/bots/api#setwebhook), since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially. |
| message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. New incoming message of any kind - text, photo, sticker, etc. |
| edited_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. New version of a message that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot. |
| channel_post | [Message](https://core.telegram.org/bots/api#message) | _Optional_. New incoming channel post of any kind - text, photo, sticker, etc. |
| edited_channel_post | [Message](https://core.telegram.org/bots/api#message) | _Optional_. New version of a channel post that is known to the bot and was edited. This update may at times be triggered by changes to message fields that are either unavailable or not actively used by your bot. |
| business_connection | [BusinessConnection](https://core.telegram.org/bots/api#businessconnection) | _Optional_. The bot was connected to or disconnected from a business account, or a user edited an existing connection with the bot |
| business_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. New message from a connected business account |
| edited_business_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. New version of a message from a connected business account |
| deleted_business_messages | [BusinessMessagesDeleted](https://core.telegram.org/bots/api#businessmessagesdeleted) | _Optional_. Messages were deleted from a connected business account |
| message_reaction | [MessageReactionUpdated](https://core.telegram.org/bots/api#messagereactionupdated) | _Optional_. A reaction to a message was changed by a user. The bot must be an administrator in the chat and must explicitly specify `"message_reaction"` in the list of _allowed\_updates_ to receive these updates. The update isn't received for reactions set by bots. |
| message_reaction_count | [MessageReactionCountUpdated](https://core.telegram.org/bots/api#messagereactioncountupdated) | _Optional_. Reactions to a message with anonymous reactions were changed. The bot must be an administrator in the chat and must explicitly specify `"message_reaction_count"` in the list of _allowed\_updates_ to receive these updates. The updates are grouped and can be sent with delay up to a few minutes. |
| inline_query | [InlineQuery](https://core.telegram.org/bots/api#inlinequery) | _Optional_. New incoming [inline](https://core.telegram.org/bots/api#inline-mode) query |
| chosen_inline_result | [ChosenInlineResult](https://core.telegram.org/bots/api#choseninlineresult) | _Optional_. The result of an [inline](https://core.telegram.org/bots/api#inline-mode) query that was chosen by a user and sent to their chat partner. Please see our documentation on the [feedback collecting](https://core.telegram.org/bots/inline#collecting-feedback) for details on how to enable these updates for your bot. |
| callback_query | [CallbackQuery](https://core.telegram.org/bots/api#callbackquery) | _Optional_. New incoming callback query |
| shipping_query | [ShippingQuery](https://core.telegram.org/bots/api#shippingquery) | _Optional_. New incoming shipping query. Only for invoices with flexible price |
| pre_checkout_query | [PreCheckoutQuery](https://core.telegram.org/bots/api#precheckoutquery) | _Optional_. New incoming pre-checkout query. Contains full information about checkout |
| purchased_paid_media | [PaidMediaPurchased](https://core.telegram.org/bots/api#paidmediapurchased) | _Optional_. A user purchased paid media with a non-empty payload sent by the bot in a non-channel chat |
| poll | [Poll](https://core.telegram.org/bots/api#poll) | _Optional_. New poll state. Bots receive only updates about manually stopped polls and polls, which are sent by the bot |
| poll_answer | [PollAnswer](https://core.telegram.org/bots/api#pollanswer) | _Optional_. A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself. |
| my_chat_member | [ChatMemberUpdated](https://core.telegram.org/bots/api#chatmemberupdated) | _Optional_. The bot's chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user. |
| chat_member | [ChatMemberUpdated](https://core.telegram.org/bots/api#chatmemberupdated) | _Optional_. A chat member's status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify `"chat_member"` in the list of _allowed\_updates_ to receive these updates. |
| chat_join_request | [ChatJoinRequest](https://core.telegram.org/bots/api#chatjoinrequest) | _Optional_. A request to join the chat has been sent. The bot must have the _can\_invite\_users_ administrator right in the chat to receive these updates. |
| chat_boost | [ChatBoostUpdated](https://core.telegram.org/bots/api#chatboostupdated) | _Optional_. A chat boost was added or changed. The bot must be an administrator in the chat to receive these updates. |
| removed_chat_boost | [ChatBoostRemoved](https://core.telegram.org/bots/api#chatboostremoved) | _Optional_. A boost was removed from a chat. The bot must be an administrator in the chat to receive these updates. |

#### [](https://core.telegram.org/bots/api#getupdates)getUpdates

Use this method to receive incoming updates using long polling ([wiki](https://en.wikipedia.org/wiki/Push_technology#Long_polling)). Returns an Array of [Update](https://core.telegram.org/bots/api#update) objects.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| offset | Integer | Optional | Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as [getUpdates](https://core.telegram.org/bots/api#getupdates) is called with an _offset_ higher than its _update\_id_. The negative offset can be specified to retrieve updates starting from _-offset_ update from the end of the updates queue. All previous updates will be forgotten. |
| limit | Integer | Optional | Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100. |
| timeout | Integer | Optional | Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only. |
| allowed_updates | Array of String | Optional | A JSON-serialized list of the update types you want your bot to receive. For example, specify `["message", "edited_channel_post", "callback_query"]` to only receive updates of these types. See [Update](https://core.telegram.org/bots/api#update) for a complete list of available update types. Specify an empty list to receive all update types except _chat\_member_, _message\_reaction_, and _message\_reaction\_count_ (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time. |

> **Notes**
> 
> **1.** This method will not work if an outgoing webhook is set up.
> 
> **2.** In order to avoid getting duplicate updates, recalculate _offset_ after each server response.

#### [](https://core.telegram.org/bots/api#setwebhook)setWebhook

Use this method to specify a URL and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified URL, containing a JSON-serialized [Update](https://core.telegram.org/bots/api#update). In case of an unsuccessful request (a request with response [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) different from `2XY`), we will repeat the request and give up after a reasonable amount of attempts. Returns _True_ on success.

If you'd like to make sure that the webhook was set by you, you can specify secret data in the parameter _secret\_token_. If specified, the request will contain a header “X-Telegram-Bot-Api-Secret-Token” with the secret token as content.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| url | String | Yes | HTTPS URL to send updates to. Use an empty string to remove webhook integration |
| certificate | [InputFile](https://core.telegram.org/bots/api#inputfile) | Optional | Upload your public key certificate so that the root certificate in use can be checked. See our [self-signed guide](https://core.telegram.org/bots/self-signed) for details. |
| ip_address | String | Optional | The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS |
| max_connections | Integer | Optional | The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to _40_. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput. |
| allowed_updates | Array of String | Optional | A JSON-serialized list of the update types you want your bot to receive. For example, specify `["message", "edited_channel_post", "callback_query"]` to only receive updates of these types. See [Update](https://core.telegram.org/bots/api#update) for a complete list of available update types. Specify an empty list to receive all update types except _chat\_member_, _message\_reaction_, and _message\_reaction\_count_ (default). If not specified, the previous setting will be used. Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time. |
| drop_pending_updates | Boolean | Optional | Pass _True_ to drop all pending updates |
| secret_token | String | Optional | A secret token to be sent in a header “X-Telegram-Bot-Api-Secret-Token” in every webhook request, 1-256 characters. Only characters `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed. The header is useful to ensure that the request comes from a webhook set by you. |

> **Notes**
> 
> **1.** You will not be able to receive updates using [getUpdates](https://core.telegram.org/bots/api#getupdates) for as long as an outgoing webhook is set up.
> 
> **2.** To use a self-signed certificate, you need to upload your [public key certificate](https://core.telegram.org/bots/self-signed) using _certificate_ parameter. Please upload as InputFile, sending a String will not work.
> 
> **3.** Ports currently supported _for webhooks_: **443, 80, 88, 8443**.
> 
> 
> If you're having any trouble setting up webhooks, please check out this [amazing guide to webhooks](https://core.telegram.org/bots/webhooks).

#### [](https://core.telegram.org/bots/api#deletewebhook)deleteWebhook

Use this method to remove webhook integration if you decide to switch back to [getUpdates](https://core.telegram.org/bots/api#getupdates). Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| drop_pending_updates | Boolean | Optional | Pass _True_ to drop all pending updates |

#### [](https://core.telegram.org/bots/api#getwebhookinfo)getWebhookInfo

Use this method to get current webhook status. Requires no parameters. On success, returns a [WebhookInfo](https://core.telegram.org/bots/api#webhookinfo) object. If the bot is using [getUpdates](https://core.telegram.org/bots/api#getupdates), will return an object with the _url_ field empty.

#### [](https://core.telegram.org/bots/api#webhookinfo)WebhookInfo

Describes the current status of a webhook.

| Field | Type | Description |
| --- | --- | --- |
| url | String | Webhook URL, may be empty if webhook is not set up |
| has_custom_certificate | Boolean | _True_, if a custom certificate was provided for webhook certificate checks |
| pending_update_count | Integer | Number of updates awaiting delivery |
| ip_address | String | _Optional_. Currently used webhook IP address |
| last_error_date | Integer | _Optional_. Unix time for the most recent error that happened when trying to deliver an update via webhook |
| last_error_message | String | _Optional_. Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook |
| last_synchronization_error_date | Integer | _Optional_. Unix time of the most recent error that happened when trying to synchronize available updates with Telegram datacenters |
| max_connections | Integer | _Optional_. The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery |
| allowed_updates | Array of String | _Optional_. A list of update types the bot is subscribed to. Defaults to all update types except _chat\_member_ |

### [](https://core.telegram.org/bots/api#available-types)Available types

All types used in the Bot API responses are represented as JSON-objects.

It is safe to use 32-bit signed integers for storing all **Integer** fields unless otherwise noted.

> **Optional** fields may be not returned when irrelevant.

#### [](https://core.telegram.org/bots/api#user)User

This object represents a Telegram user or bot.

| Field | Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. |
| is_bot | Boolean | _True_, if this user is a bot |
| first_name | String | User's or bot's first name |
| last_name | String | _Optional_. User's or bot's last name |
| username | String | _Optional_. User's or bot's username |
| language_code | String | _Optional_. [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) of the user's language |
| is_premium | True | _Optional_. _True_, if this user is a Telegram Premium user |
| added_to_attachment_menu | True | _Optional_. _True_, if this user added the bot to the attachment menu |
| can_join_groups | Boolean | _Optional_. _True_, if the bot can be invited to groups. Returned only in [getMe](https://core.telegram.org/bots/api#getme). |
| can_read_all_group_messages | Boolean | _Optional_. _True_, if [privacy mode](https://core.telegram.org/bots/features#privacy-mode) is disabled for the bot. Returned only in [getMe](https://core.telegram.org/bots/api#getme). |
| supports_inline_queries | Boolean | _Optional_. _True_, if the bot supports inline queries. Returned only in [getMe](https://core.telegram.org/bots/api#getme). |
| can_connect_to_business | Boolean | _Optional_. _True_, if the bot can be connected to a Telegram Business account to receive its messages. Returned only in [getMe](https://core.telegram.org/bots/api#getme). |
| has_main_web_app | Boolean | _Optional_. _True_, if the bot has a main Web App. Returned only in [getMe](https://core.telegram.org/bots/api#getme). |

#### [](https://core.telegram.org/bots/api#chat)Chat

This object represents a chat.

| Field | Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. |
| type | String | Type of the chat, can be either “private”, “group”, “supergroup” or “channel” |
| title | String | _Optional_. Title, for supergroups, channels and group chats |
| username | String | _Optional_. Username, for private chats, supergroups and channels if available |
| first_name | String | _Optional_. First name of the other party in a private chat |
| last_name | String | _Optional_. Last name of the other party in a private chat |
| is_forum | True | _Optional_. _True_, if the supergroup chat is a forum (has [topics](https://telegram.org/blog/topics-in-groups-collectible-usernames#topics-in-groups) enabled) |
| is_direct_messages | True | _Optional_. _True_, if the chat is the direct messages chat of a channel |

#### [](https://core.telegram.org/bots/api#chatfullinfo)ChatFullInfo

This object contains full information about a chat.

| Field | Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. |
| type | String | Type of the chat, can be either “private”, “group”, “supergroup” or “channel” |
| title | String | _Optional_. Title, for supergroups, channels and group chats |
| username | String | _Optional_. Username, for private chats, supergroups and channels if available |
| first_name | String | _Optional_. First name of the other party in a private chat |
| last_name | String | _Optional_. Last name of the other party in a private chat |
| is_forum | True | _Optional_. _True_, if the supergroup chat is a forum (has [topics](https://telegram.org/blog/topics-in-groups-collectible-usernames#topics-in-groups) enabled) |
| is_direct_messages | True | _Optional_. _True_, if the chat is the direct messages chat of a channel |
| accent_color_id | Integer | Identifier of the accent color for the chat name and backgrounds of the chat photo, reply header, and link preview. See [accent colors](https://core.telegram.org/bots/api#accent-colors) for more details. |
| max_reaction_count | Integer | The maximum number of reactions that can be set on a message in the chat |
| photo | [ChatPhoto](https://core.telegram.org/bots/api#chatphoto) | _Optional_. Chat photo |
| active_usernames | Array of String | _Optional_. If non-empty, the list of all [active chat usernames](https://telegram.org/blog/topics-in-groups-collectible-usernames#collectible-usernames); for private chats, supergroups and channels |
| birthdate | [Birthdate](https://core.telegram.org/bots/api#birthdate) | _Optional_. For private chats, the date of birth of the user |
| business_intro | [BusinessIntro](https://core.telegram.org/bots/api#businessintro) | _Optional_. For private chats with business accounts, the intro of the business |
| business_location | [BusinessLocation](https://core.telegram.org/bots/api#businesslocation) | _Optional_. For private chats with business accounts, the location of the business |
| business_opening_hours | [BusinessOpeningHours](https://core.telegram.org/bots/api#businessopeninghours) | _Optional_. For private chats with business accounts, the opening hours of the business |
| personal_chat | [Chat](https://core.telegram.org/bots/api#chat) | _Optional_. For private chats, the personal channel of the user |
| parent_chat | [Chat](https://core.telegram.org/bots/api#chat) | _Optional_. Information about the corresponding channel chat; for direct messages chats only |
| available_reactions | Array of [ReactionType](https://core.telegram.org/bots/api#reactiontype) | _Optional_. List of available reactions allowed in the chat. If omitted, then all [emoji reactions](https://core.telegram.org/bots/api#reactiontypeemoji) are allowed. |
| background_custom_emoji_id | String | _Optional_. Custom emoji identifier of the emoji chosen by the chat for the reply header and link preview background |
| profile_accent_color_id | Integer | _Optional_. Identifier of the accent color for the chat's profile background. See [profile accent colors](https://core.telegram.org/bots/api#profile-accent-colors) for more details. |
| profile_background_custom_emoji_id | String | _Optional_. Custom emoji identifier of the emoji chosen by the chat for its profile background |
| emoji_status_custom_emoji_id | String | _Optional_. Custom emoji identifier of the emoji status of the chat or the other party in a private chat |
| emoji_status_expiration_date | Integer | _Optional_. Expiration date of the emoji status of the chat or the other party in a private chat, in Unix time, if any |
| bio | String | _Optional_. Bio of the other party in a private chat |
| has_private_forwards | True | _Optional_. _True_, if privacy settings of the other party in the private chat allows to use `tg://user?id=<user_id>` links only in chats with the user |
| has_restricted_voice_and_video_messages | True | _Optional_. _True_, if the privacy settings of the other party restrict sending voice and video note messages in the private chat |
| join_to_send_messages | True | _Optional_. _True_, if users need to join the supergroup before they can send messages |
| join_by_request | True | _Optional_. _True_, if all users directly joining the supergroup without using an invite link need to be approved by supergroup administrators |
| description | String | _Optional_. Description, for groups, supergroups and channel chats |
| invite_link | String | _Optional_. Primary invite link, for groups, supergroups and channel chats |
| pinned_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. The most recent pinned message (by sending date) |
| permissions | [ChatPermissions](https://core.telegram.org/bots/api#chatpermissions) | _Optional_. Default chat member permissions, for groups and supergroups |
| accepted_gift_types | [AcceptedGiftTypes](https://core.telegram.org/bots/api#acceptedgifttypes) | Information about types of gifts that are accepted by the chat or by the corresponding user for private chats |
| can_send_paid_media | True | _Optional_. _True_, if paid media messages can be sent or forwarded to the channel chat. The field is available only for channel chats. |
| slow_mode_delay | Integer | _Optional_. For supergroups, the minimum allowed delay between consecutive messages sent by each unprivileged user; in seconds |
| unrestrict_boost_count | Integer | _Optional_. For supergroups, the minimum number of boosts that a non-administrator user needs to add in order to ignore slow mode and chat permissions |
| message_auto_delete_time | Integer | _Optional_. The time after which all messages sent to the chat will be automatically deleted; in seconds |
| has_aggressive_anti_spam_enabled | True | _Optional_. _True_, if aggressive anti-spam checks are enabled in the supergroup. The field is only available to chat administrators. |
| has_hidden_members | True | _Optional_. _True_, if non-administrators can only get the list of bots and administrators in the chat |
| has_protected_content | True | _Optional_. _True_, if messages from the chat can't be forwarded to other chats |
| has_visible_history | True | _Optional_. _True_, if new chat members will have access to old messages; available only to chat administrators |
| sticker_set_name | String | _Optional_. For supergroups, name of the group sticker set |
| can_set_sticker_set | True | _Optional_. _True_, if the bot can change the group sticker set |
| custom_emoji_sticker_set_name | String | _Optional_. For supergroups, the name of the group's custom emoji sticker set. Custom emoji from this set can be used by all users and bots in the group. |
| linked_chat_id | Integer | _Optional_. Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier. |
| location | [ChatLocation](https://core.telegram.org/bots/api#chatlocation) | _Optional_. For supergroups, the location to which the supergroup is connected |

#### [](https://core.telegram.org/bots/api#message)Message

This object represents a message.

| Field | Type | Description |
| --- | --- | --- |
| message_id | Integer | Unique message identifier inside this chat. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent |
| message_thread_id | Integer | _Optional_. Unique identifier of a message thread to which the message belongs; for supergroups only |
| direct_messages_topic | [DirectMessagesTopic](https://core.telegram.org/bots/api#directmessagestopic) | _Optional_. Information about the direct messages chat topic that contains the message |
| from | [User](https://core.telegram.org/bots/api#user) | _Optional_. Sender of the message; may be empty for messages sent to channels. For backward compatibility, if the message was sent on behalf of a chat, the field contains a fake sender user in non-channel chats |
| sender_chat | [Chat](https://core.telegram.org/bots/api#chat) | _Optional_. Sender of the message when sent on behalf of a chat. For example, the supergroup itself for messages sent by its anonymous administrators or a linked channel for messages automatically forwarded to the channel's discussion group. For backward compatibility, if the message was sent on behalf of a chat, the field _from_ contains a fake sender user in non-channel chats. |
| sender_boost_count | Integer | _Optional_. If the sender of the message boosted the chat, the number of boosts added by the user |
| sender_business_bot | [User](https://core.telegram.org/bots/api#user) | _Optional_. The bot that actually sent the message on behalf of the business account. Available only for outgoing messages sent on behalf of the connected business account. |
| date | Integer | Date the message was sent in Unix time. It is always a positive number, representing a valid date. |
| business_connection_id | String | _Optional_. Unique identifier of the business connection from which the message was received. If non-empty, the message belongs to a chat of the corresponding business account that is independent from any potential bot chat which might share the same identifier. |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | Chat the message belongs to |
| forward_origin | [MessageOrigin](https://core.telegram.org/bots/api#messageorigin) | _Optional_. Information about the original message for forwarded messages |
| is_topic_message | True | _Optional_. _True_, if the message is sent to a forum topic |
| is_automatic_forward | True | _Optional_. _True_, if the message is a channel post that was automatically forwarded to the connected discussion group |
| reply_to_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. For replies in the same chat and message thread, the original message. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain further _reply\_to\_message_ fields even if it itself is a reply. |
| external_reply | [ExternalReplyInfo](https://core.telegram.org/bots/api#externalreplyinfo) | _Optional_. Information about the message that is being replied to, which may come from another chat or forum topic |
| quote | [TextQuote](https://core.telegram.org/bots/api#textquote) | _Optional_. For replies that quote part of the original message, the quoted part of the message |
| reply_to_story | [Story](https://core.telegram.org/bots/api#story) | _Optional_. For replies to a story, the original story |
| reply_to_checklist_task_id | Integer | _Optional_. Identifier of the specific checklist task that is being replied to |
| via_bot | [User](https://core.telegram.org/bots/api#user) | _Optional_. Bot through which the message was sent |
| edit_date | Integer | _Optional_. Date the message was last edited in Unix time |
| has_protected_content | True | _Optional_. _True_, if the message can't be forwarded |
| is_from_offline | True | _Optional_. _True_, if the message was sent by an implicit action, for example, as an away or a greeting business message, or as a scheduled message |
| is_paid_post | True | _Optional_. _True_, if the message is a paid post. Note that such posts must not be deleted for 24 hours to receive the payment and can't be edited. |
| media_group_id | String | _Optional_. The unique identifier of a media message group this message belongs to |
| author_signature | String | _Optional_. Signature of the post author for messages in channels, or the custom title of an anonymous group administrator |
| paid_star_count | Integer | _Optional_. The number of Telegram Stars that were paid by the sender of the message to send it |
| text | String | _Optional_. For text messages, the actual UTF-8 text of the message |
| entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text |
| link_preview_options | [LinkPreviewOptions](https://core.telegram.org/bots/api#linkpreviewoptions) | _Optional_. Options used for link preview generation for the message, if it is a text message and link preview options were changed |
| suggested_post_info | [SuggestedPostInfo](https://core.telegram.org/bots/api#suggestedpostinfo) | _Optional_. Information about suggested post parameters if the message is a suggested post in a channel direct messages chat. If the message is an approved or declined suggested post, then it can't be edited. |
| effect_id | String | _Optional_. Unique identifier of the message effect added to the message |
| animation | [Animation](https://core.telegram.org/bots/api#animation) | _Optional_. Message is an animation, information about the animation. For backward compatibility, when this field is set, the _document_ field will also be set |
| audio | [Audio](https://core.telegram.org/bots/api#audio) | _Optional_. Message is an audio file, information about the file |
| document | [Document](https://core.telegram.org/bots/api#document) | _Optional_. Message is a general file, information about the file |
| paid_media | [PaidMediaInfo](https://core.telegram.org/bots/api#paidmediainfo) | _Optional_. Message contains paid media; information about the paid media |
| photo | Array of [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Message is a photo, available sizes of the photo |
| sticker | [Sticker](https://core.telegram.org/bots/api#sticker) | _Optional_. Message is a sticker, information about the sticker |
| story | [Story](https://core.telegram.org/bots/api#story) | _Optional_. Message is a forwarded story |
| video | [Video](https://core.telegram.org/bots/api#video) | _Optional_. Message is a video, information about the video |
| video_note | [VideoNote](https://core.telegram.org/bots/api#videonote) | _Optional_. Message is a [video note](https://telegram.org/blog/video-messages-and-telescope), information about the video message |
| voice | [Voice](https://core.telegram.org/bots/api#voice) | _Optional_. Message is a voice message, information about the file |
| caption | String | _Optional_. Caption for the animation, audio, document, paid media, photo, video or voice |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption |
| show_caption_above_media | True | _Optional_. _True_, if the caption must be shown above the message media |
| has_media_spoiler | True | _Optional_. _True_, if the message media is covered by a spoiler animation |
| checklist | [Checklist](https://core.telegram.org/bots/api#checklist) | _Optional_. Message is a checklist |
| contact | [Contact](https://core.telegram.org/bots/api#contact) | _Optional_. Message is a shared contact, information about the contact |
| dice | [Dice](https://core.telegram.org/bots/api#dice) | _Optional_. Message is a dice with random value |
| game | [Game](https://core.telegram.org/bots/api#game) | _Optional_. Message is a game, information about the game. [More about games »](https://core.telegram.org/bots/api#games) |
| poll | [Poll](https://core.telegram.org/bots/api#poll) | _Optional_. Message is a native poll, information about the poll |
| venue | [Venue](https://core.telegram.org/bots/api#venue) | _Optional_. Message is a venue, information about the venue. For backward compatibility, when this field is set, the _location_ field will also be set |
| location | [Location](https://core.telegram.org/bots/api#location) | _Optional_. Message is a shared location, information about the location |
| new_chat_members | Array of [User](https://core.telegram.org/bots/api#user) | _Optional_. New members that were added to the group or supergroup and information about them (the bot itself may be one of these members) |
| left_chat_member | [User](https://core.telegram.org/bots/api#user) | _Optional_. A member was removed from the group, information about them (this member may be the bot itself) |
| new_chat_title | String | _Optional_. A chat title was changed to this value |
| new_chat_photo | Array of [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. A chat photo was change to this value |
| delete_chat_photo | True | _Optional_. Service message: the chat photo was deleted |
| group_chat_created | True | _Optional_. Service message: the group has been created |
| supergroup_chat_created | True | _Optional_. Service message: the supergroup has been created. This field can't be received in a message coming through updates, because bot can't be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup. |
| channel_chat_created | True | _Optional_. Service message: the channel has been created. This field can't be received in a message coming through updates, because bot can't be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel. |
| message_auto_delete_timer_changed | [MessageAutoDeleteTimerChanged](https://core.telegram.org/bots/api#messageautodeletetimerchanged) | _Optional_. Service message: auto-delete timer settings changed in the chat |
| migrate_to_chat_id | Integer | _Optional_. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. |
| migrate_from_chat_id | Integer | _Optional_. The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. |
| pinned_message | [MaybeInaccessibleMessage](https://core.telegram.org/bots/api#maybeinaccessiblemessage) | _Optional_. Specified message was pinned. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain further _reply\_to\_message_ fields even if it itself is a reply. |
| invoice | [Invoice](https://core.telegram.org/bots/api#invoice) | _Optional_. Message is an invoice for a [payment](https://core.telegram.org/bots/api#payments), information about the invoice. [More about payments »](https://core.telegram.org/bots/api#payments) |
| successful_payment | [SuccessfulPayment](https://core.telegram.org/bots/api#successfulpayment) | _Optional_. Message is a service message about a successful payment, information about the payment. [More about payments »](https://core.telegram.org/bots/api#payments) |
| refunded_payment | [RefundedPayment](https://core.telegram.org/bots/api#refundedpayment) | _Optional_. Message is a service message about a refunded payment, information about the payment. [More about payments »](https://core.telegram.org/bots/api#payments) |
| users_shared | [UsersShared](https://core.telegram.org/bots/api#usersshared) | _Optional_. Service message: users were shared with the bot |
| chat_shared | [ChatShared](https://core.telegram.org/bots/api#chatshared) | _Optional_. Service message: a chat was shared with the bot |
| gift | [GiftInfo](https://core.telegram.org/bots/api#giftinfo) | _Optional_. Service message: a regular gift was sent or received |
| unique_gift | [UniqueGiftInfo](https://core.telegram.org/bots/api#uniquegiftinfo) | _Optional_. Service message: a unique gift was sent or received |
| connected_website | String | _Optional_. The domain name of the website on which the user has logged in. [More about Telegram Login »](https://core.telegram.org/widgets/login) |
| write_access_allowed | [WriteAccessAllowed](https://core.telegram.org/bots/api#writeaccessallowed) | _Optional_. Service message: the user allowed the bot to write messages after adding it to the attachment or side menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method [requestWriteAccess](https://core.telegram.org/bots/webapps#initializing-mini-apps) |
| passport_data | [PassportData](https://core.telegram.org/bots/api#passportdata) | _Optional_. Telegram Passport data |
| proximity_alert_triggered | [ProximityAlertTriggered](https://core.telegram.org/bots/api#proximityalerttriggered) | _Optional_. Service message. A user in the chat triggered another user's proximity alert while sharing Live Location. |
| boost_added | [ChatBoostAdded](https://core.telegram.org/bots/api#chatboostadded) | _Optional_. Service message: user boosted the chat |
| chat_background_set | [ChatBackground](https://core.telegram.org/bots/api#chatbackground) | _Optional_. Service message: chat background set |
| checklist_tasks_done | [ChecklistTasksDone](https://core.telegram.org/bots/api#checklisttasksdone) | _Optional_. Service message: some tasks in a checklist were marked as done or not done |
| checklist_tasks_added | [ChecklistTasksAdded](https://core.telegram.org/bots/api#checklisttasksadded) | _Optional_. Service message: tasks were added to a checklist |
| direct_message_price_changed | [DirectMessagePriceChanged](https://core.telegram.org/bots/api#directmessagepricechanged) | _Optional_. Service message: the price for paid messages in the corresponding direct messages chat of a channel has changed |
| forum_topic_created | [ForumTopicCreated](https://core.telegram.org/bots/api#forumtopiccreated) | _Optional_. Service message: forum topic created |
| forum_topic_edited | [ForumTopicEdited](https://core.telegram.org/bots/api#forumtopicedited) | _Optional_. Service message: forum topic edited |
| forum_topic_closed | [ForumTopicClosed](https://core.telegram.org/bots/api#forumtopicclosed) | _Optional_. Service message: forum topic closed |
| forum_topic_reopened | [ForumTopicReopened](https://core.telegram.org/bots/api#forumtopicreopened) | _Optional_. Service message: forum topic reopened |
| general_forum_topic_hidden | [GeneralForumTopicHidden](https://core.telegram.org/bots/api#generalforumtopichidden) | _Optional_. Service message: the 'General' forum topic hidden |
| general_forum_topic_unhidden | [GeneralForumTopicUnhidden](https://core.telegram.org/bots/api#generalforumtopicunhidden) | _Optional_. Service message: the 'General' forum topic unhidden |
| giveaway_created | [GiveawayCreated](https://core.telegram.org/bots/api#giveawaycreated) | _Optional_. Service message: a scheduled giveaway was created |
| giveaway | [Giveaway](https://core.telegram.org/bots/api#giveaway) | _Optional_. The message is a scheduled giveaway message |
| giveaway_winners | [GiveawayWinners](https://core.telegram.org/bots/api#giveawaywinners) | _Optional_. A giveaway with public winners was completed |
| giveaway_completed | [GiveawayCompleted](https://core.telegram.org/bots/api#giveawaycompleted) | _Optional_. Service message: a giveaway without public winners was completed |
| paid_message_price_changed | [PaidMessagePriceChanged](https://core.telegram.org/bots/api#paidmessagepricechanged) | _Optional_. Service message: the price for paid messages has changed in the chat |
| suggested_post_approved | [SuggestedPostApproved](https://core.telegram.org/bots/api#suggestedpostapproved) | _Optional_. Service message: a suggested post was approved |
| suggested_post_approval_failed | [SuggestedPostApprovalFailed](https://core.telegram.org/bots/api#suggestedpostapprovalfailed) | _Optional_. Service message: approval of a suggested post has failed |
| suggested_post_declined | [SuggestedPostDeclined](https://core.telegram.org/bots/api#suggestedpostdeclined) | _Optional_. Service message: a suggested post was declined |
| suggested_post_paid | [SuggestedPostPaid](https://core.telegram.org/bots/api#suggestedpostpaid) | _Optional_. Service message: payment for a suggested post was received |
| suggested_post_refunded | [SuggestedPostRefunded](https://core.telegram.org/bots/api#suggestedpostrefunded) | _Optional_. Service message: payment for a suggested post was refunded |
| video_chat_scheduled | [VideoChatScheduled](https://core.telegram.org/bots/api#videochatscheduled) | _Optional_. Service message: video chat scheduled |
| video_chat_started | [VideoChatStarted](https://core.telegram.org/bots/api#videochatstarted) | _Optional_. Service message: video chat started |
| video_chat_ended | [VideoChatEnded](https://core.telegram.org/bots/api#videochatended) | _Optional_. Service message: video chat ended |
| video_chat_participants_invited | [VideoChatParticipantsInvited](https://core.telegram.org/bots/api#videochatparticipantsinvited) | _Optional_. Service message: new participants invited to a video chat |
| web_app_data | [WebAppData](https://core.telegram.org/bots/api#webappdata) | _Optional_. Service message: data sent by a Web App |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. Inline keyboard attached to the message. `login_url` buttons are represented as ordinary `url` buttons. |

#### [](https://core.telegram.org/bots/api#messageid)MessageId

This object represents a unique message identifier.

| Field | Type | Description |
| --- | --- | --- |
| message_id | Integer | Unique message identifier. In specific instances (e.g., message containing a video sent to a big chat), the server might automatically schedule a message instead of sending it immediately. In such cases, this field will be 0 and the relevant message will be unusable until it is actually sent |

#### [](https://core.telegram.org/bots/api#inaccessiblemessage)InaccessibleMessage

This object describes a message that was deleted or is otherwise inaccessible to the bot.

| Field | Type | Description |
| --- | --- | --- |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | Chat the message belonged to |
| message_id | Integer | Unique message identifier inside the chat |
| date | Integer | Always 0. The field can be used to differentiate regular and inaccessible messages. |

#### [](https://core.telegram.org/bots/api#maybeinaccessiblemessage)MaybeInaccessibleMessage

This object describes a message that can be inaccessible to the bot. It can be one of

*   [Message](https://core.telegram.org/bots/api#message)
*   [InaccessibleMessage](https://core.telegram.org/bots/api#inaccessiblemessage)

#### [](https://core.telegram.org/bots/api#messageentity)MessageEntity

This object represents one special entity in a text message. For example, hashtags, usernames, URLs, etc.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the entity. Currently, can be “mention” (`@username`), “hashtag” (`#hashtag` or `#hashtag@chatusername`), “cashtag” (`$USD` or `$USD@chatusername`), “bot_command” (`/start@jobs_bot`), “url” (`https://telegram.org`), “email” (`do-not-reply@telegram.org`), “phone_number” (`+1-212-555-0123`), “bold” (**bold text**), “italic” (_italic text_), “underline” (underlined text), “strikethrough” (strikethrough text), “spoiler” (spoiler message), “blockquote” (block quotation), “expandable_blockquote” (collapsed-by-default block quotation), “code” (monowidth string), “pre” (monowidth block), “text_link” (for clickable text URLs), “text_mention” (for users [without usernames](https://telegram.org/blog/edit#new-mentions)), “custom_emoji” (for inline custom emoji stickers) |
| offset | Integer | Offset in [UTF-16 code units](https://core.telegram.org/api/entities#entity-length) to the start of the entity |
| length | Integer | Length of the entity in [UTF-16 code units](https://core.telegram.org/api/entities#entity-length) |
| url | String | _Optional_. For “text_link” only, URL that will be opened after user taps on the text |
| user | [User](https://core.telegram.org/bots/api#user) | _Optional_. For “text_mention” only, the mentioned user |
| language | String | _Optional_. For “pre” only, the programming language of the entity text |
| custom_emoji_id | String | _Optional_. For “custom_emoji” only, unique identifier of the custom emoji. Use [getCustomEmojiStickers](https://core.telegram.org/bots/api#getcustomemojistickers) to get full information about the sticker |

#### [](https://core.telegram.org/bots/api#textquote)TextQuote

This object contains information about the quoted part of a message that is replied to by the given message.

| Field | Type | Description |
| --- | --- | --- |
| text | String | Text of the quoted part of a message that is replied to by the given message |
| entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. Special entities that appear in the quote. Currently, only _bold_, _italic_, _underline_, _strikethrough_, _spoiler_, and _custom\_emoji_ entities are kept in quotes. |
| position | Integer | Approximate quote position in the original message in UTF-16 code units as specified by the sender |
| is_manual | True | _Optional_. _True_, if the quote was chosen manually by the message sender. Otherwise, the quote was added automatically by the server. |

#### [](https://core.telegram.org/bots/api#externalreplyinfo)ExternalReplyInfo

This object contains information about a message that is being replied to, which may come from another chat or forum topic.

| Field | Type | Description |
| --- | --- | --- |
| origin | [MessageOrigin](https://core.telegram.org/bots/api#messageorigin) | Origin of the message replied to by the given message |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | _Optional_. Chat the original message belongs to. Available only if the chat is a supergroup or a channel. |
| message_id | Integer | _Optional_. Unique message identifier inside the original chat. Available only if the original chat is a supergroup or a channel. |
| link_preview_options | [LinkPreviewOptions](https://core.telegram.org/bots/api#linkpreviewoptions) | _Optional_. Options used for link preview generation for the original message, if it is a text message |
| animation | [Animation](https://core.telegram.org/bots/api#animation) | _Optional_. Message is an animation, information about the animation |
| audio | [Audio](https://core.telegram.org/bots/api#audio) | _Optional_. Message is an audio file, information about the file |
| document | [Document](https://core.telegram.org/bots/api#document) | _Optional_. Message is a general file, information about the file |
| paid_media | [PaidMediaInfo](https://core.telegram.org/bots/api#paidmediainfo) | _Optional_. Message contains paid media; information about the paid media |
| photo | Array of [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Message is a photo, available sizes of the photo |
| sticker | [Sticker](https://core.telegram.org/bots/api#sticker) | _Optional_. Message is a sticker, information about the sticker |
| story | [Story](https://core.telegram.org/bots/api#story) | _Optional_. Message is a forwarded story |
| video | [Video](https://core.telegram.org/bots/api#video) | _Optional_. Message is a video, information about the video |
| video_note | [VideoNote](https://core.telegram.org/bots/api#videonote) | _Optional_. Message is a [video note](https://telegram.org/blog/video-messages-and-telescope), information about the video message |
| voice | [Voice](https://core.telegram.org/bots/api#voice) | _Optional_. Message is a voice message, information about the file |
| has_media_spoiler | True | _Optional_. _True_, if the message media is covered by a spoiler animation |
| checklist | [Checklist](https://core.telegram.org/bots/api#checklist) | _Optional_. Message is a checklist |
| contact | [Contact](https://core.telegram.org/bots/api#contact) | _Optional_. Message is a shared contact, information about the contact |
| dice | [Dice](https://core.telegram.org/bots/api#dice) | _Optional_. Message is a dice with random value |
| game | [Game](https://core.telegram.org/bots/api#game) | _Optional_. Message is a game, information about the game. [More about games »](https://core.telegram.org/bots/api#games) |
| giveaway | [Giveaway](https://core.telegram.org/bots/api#giveaway) | _Optional_. Message is a scheduled giveaway, information about the giveaway |
| giveaway_winners | [GiveawayWinners](https://core.telegram.org/bots/api#giveawaywinners) | _Optional_. A giveaway with public winners was completed |
| invoice | [Invoice](https://core.telegram.org/bots/api#invoice) | _Optional_. Message is an invoice for a [payment](https://core.telegram.org/bots/api#payments), information about the invoice. [More about payments »](https://core.telegram.org/bots/api#payments) |
| location | [Location](https://core.telegram.org/bots/api#location) | _Optional_. Message is a shared location, information about the location |
| poll | [Poll](https://core.telegram.org/bots/api#poll) | _Optional_. Message is a native poll, information about the poll |
| venue | [Venue](https://core.telegram.org/bots/api#venue) | _Optional_. Message is a venue, information about the venue |

#### [](https://core.telegram.org/bots/api#replyparameters)ReplyParameters

Describes reply parameters for the message that is being sent.

| Field | Type | Description |
| --- | --- | --- |
| message_id | Integer | Identifier of the message that will be replied to in the current chat, or in the chat _chat\_id_ if it is specified |
| chat_id | Integer or String | _Optional_. If the message to be replied to is from a different chat, unique identifier for the chat or username of the channel (in the format `@channelusername`). Not supported for messages sent on behalf of a business account and messages from channel direct messages chats. |
| allow_sending_without_reply | Boolean | _Optional_. Pass _True_ if the message should be sent even if the specified message to be replied to is not found. Always _False_ for replies in another chat or forum topic. Always _True_ for messages sent on behalf of a business account. |
| quote | String | _Optional_. Quoted part of the message to be replied to; 0-1024 characters after entities parsing. The quote must be an exact substring of the message to be replied to, including _bold_, _italic_, _underline_, _strikethrough_, _spoiler_, and _custom\_emoji_ entities. The message will fail to send if the quote isn't found in the original message. |
| quote_parse_mode | String | _Optional_. Mode for parsing entities in the quote. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| quote_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. A JSON-serialized list of special entities that appear in the quote. It can be specified instead of _quote\_parse\_mode_. |
| quote_position | Integer | _Optional_. Position of the quote in the original message in UTF-16 code units |
| checklist_task_id | Integer | _Optional_. Identifier of the specific checklist task to be replied to |

#### [](https://core.telegram.org/bots/api#messageorigin)MessageOrigin

This object describes the origin of a message. It can be one of

*   [MessageOriginUser](https://core.telegram.org/bots/api#messageoriginuser)
*   [MessageOriginHiddenUser](https://core.telegram.org/bots/api#messageoriginhiddenuser)
*   [MessageOriginChat](https://core.telegram.org/bots/api#messageoriginchat)
*   [MessageOriginChannel](https://core.telegram.org/bots/api#messageoriginchannel)

#### [](https://core.telegram.org/bots/api#messageoriginuser)MessageOriginUser

The message was originally sent by a known user.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the message origin, always “user” |
| date | Integer | Date the message was sent originally in Unix time |
| sender_user | [User](https://core.telegram.org/bots/api#user) | User that sent the message originally |

#### [](https://core.telegram.org/bots/api#messageoriginhiddenuser)MessageOriginHiddenUser

The message was originally sent by an unknown user.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the message origin, always “hidden_user” |
| date | Integer | Date the message was sent originally in Unix time |
| sender_user_name | String | Name of the user that sent the message originally |

#### [](https://core.telegram.org/bots/api#messageoriginchat)MessageOriginChat

The message was originally sent on behalf of a chat to a group chat.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the message origin, always “chat” |
| date | Integer | Date the message was sent originally in Unix time |
| sender_chat | [Chat](https://core.telegram.org/bots/api#chat) | Chat that sent the message originally |
| author_signature | String | _Optional_. For messages originally sent by an anonymous chat administrator, original message author signature |

#### [](https://core.telegram.org/bots/api#messageoriginchannel)MessageOriginChannel

The message was originally sent to a channel chat.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the message origin, always “channel” |
| date | Integer | Date the message was sent originally in Unix time |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | Channel chat to which the message was originally sent |
| message_id | Integer | Unique message identifier inside the chat |
| author_signature | String | _Optional_. Signature of the original post author |

#### [](https://core.telegram.org/bots/api#photosize)PhotoSize

This object represents one size of a photo or a [file](https://core.telegram.org/bots/api#document) / [sticker](https://core.telegram.org/bots/api#sticker) thumbnail.

| Field | Type | Description |
| --- | --- | --- |
| file_id | String | Identifier for this file, which can be used to download or reuse the file |
| file_unique_id | String | Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| width | Integer | Photo width |
| height | Integer | Photo height |
| file_size | Integer | _Optional_. File size in bytes |

#### [](https://core.telegram.org/bots/api#animation)Animation

This object represents an animation file (GIF or H.264/MPEG-4 AVC video without sound).

| Field | Type | Description |
| --- | --- | --- |
| file_id | String | Identifier for this file, which can be used to download or reuse the file |
| file_unique_id | String | Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| width | Integer | Video width as defined by the sender |
| height | Integer | Video height as defined by the sender |
| duration | Integer | Duration of the video in seconds as defined by the sender |
| thumbnail | [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Animation thumbnail as defined by the sender |
| file_name | String | _Optional_. Original animation filename as defined by the sender |
| mime_type | String | _Optional_. MIME type of the file as defined by the sender |
| file_size | Integer | _Optional_. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. |

#### [](https://core.telegram.org/bots/api#audio)Audio

This object represents an audio file to be treated as music by the Telegram clients.

| Field | Type | Description |
| --- | --- | --- |
| file_id | String | Identifier for this file, which can be used to download or reuse the file |
| file_unique_id | String | Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| duration | Integer | Duration of the audio in seconds as defined by the sender |
| performer | String | _Optional_. Performer of the audio as defined by the sender or by audio tags |
| title | String | _Optional_. Title of the audio as defined by the sender or by audio tags |
| file_name | String | _Optional_. Original filename as defined by the sender |
| mime_type | String | _Optional_. MIME type of the file as defined by the sender |
| file_size | Integer | _Optional_. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. |
| thumbnail | [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Thumbnail of the album cover to which the music file belongs |

#### [](https://core.telegram.org/bots/api#document)Document

This object represents a general file (as opposed to [photos](https://core.telegram.org/bots/api#photosize), [voice messages](https://core.telegram.org/bots/api#voice) and [audio files](https://core.telegram.org/bots/api#audio)).

| Field | Type | Description |
| --- | --- | --- |
| file_id | String | Identifier for this file, which can be used to download or reuse the file |
| file_unique_id | String | Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| thumbnail | [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Document thumbnail as defined by the sender |
| file_name | String | _Optional_. Original filename as defined by the sender |
| mime_type | String | _Optional_. MIME type of the file as defined by the sender |
| file_size | Integer | _Optional_. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. |

#### [](https://core.telegram.org/bots/api#story)Story

This object represents a story.

| Field | Type | Description |
| --- | --- | --- |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | Chat that posted the story |
| id | Integer | Unique identifier for the story in the chat |

#### [](https://core.telegram.org/bots/api#video)Video

This object represents a video file.

| Field | Type | Description |
| --- | --- | --- |
| file_id | String | Identifier for this file, which can be used to download or reuse the file |
| file_unique_id | String | Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| width | Integer | Video width as defined by the sender |
| height | Integer | Video height as defined by the sender |
| duration | Integer | Duration of the video in seconds as defined by the sender |
| thumbnail | [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Video thumbnail |
| cover | Array of [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Available sizes of the cover of the video in the message |
| start_timestamp | Integer | _Optional_. Timestamp in seconds from which the video will play in the message |
| file_name | String | _Optional_. Original filename as defined by the sender |
| mime_type | String | _Optional_. MIME type of the file as defined by the sender |
| file_size | Integer | _Optional_. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. |

#### [](https://core.telegram.org/bots/api#videonote)VideoNote

This object represents a [video message](https://telegram.org/blog/video-messages-and-telescope) (available in Telegram apps as of [v.4.0](https://telegram.org/blog/video-messages-and-telescope)).

| Field | Type | Description |
| --- | --- | --- |
| file_id | String | Identifier for this file, which can be used to download or reuse the file |
| file_unique_id | String | Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| length | Integer | Video width and height (diameter of the video message) as defined by the sender |
| duration | Integer | Duration of the video in seconds as defined by the sender |
| thumbnail | [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Video thumbnail |
| file_size | Integer | _Optional_. File size in bytes |

#### [](https://core.telegram.org/bots/api#voice)Voice

This object represents a voice note.

| Field | Type | Description |
| --- | --- | --- |
| file_id | String | Identifier for this file, which can be used to download or reuse the file |
| file_unique_id | String | Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| duration | Integer | Duration of the audio in seconds as defined by the sender |
| mime_type | String | _Optional_. MIME type of the file as defined by the sender |
| file_size | Integer | _Optional_. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. |

#### [](https://core.telegram.org/bots/api#paidmediainfo)PaidMediaInfo

Describes the paid media added to a message.

| Field | Type | Description |
| --- | --- | --- |
| star_count | Integer | The number of Telegram Stars that must be paid to buy access to the media |
| paid_media | Array of [PaidMedia](https://core.telegram.org/bots/api#paidmedia) | Information about the paid media |

#### [](https://core.telegram.org/bots/api#paidmedia)PaidMedia

This object describes paid media. Currently, it can be one of

*   [PaidMediaPreview](https://core.telegram.org/bots/api#paidmediapreview)
*   [PaidMediaPhoto](https://core.telegram.org/bots/api#paidmediaphoto)
*   [PaidMediaVideo](https://core.telegram.org/bots/api#paidmediavideo)

#### [](https://core.telegram.org/bots/api#paidmediapreview)PaidMediaPreview

The paid media isn't available before the payment.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the paid media, always “preview” |
| width | Integer | _Optional_. Media width as defined by the sender |
| height | Integer | _Optional_. Media height as defined by the sender |
| duration | Integer | _Optional_. Duration of the media in seconds as defined by the sender |

#### [](https://core.telegram.org/bots/api#paidmediaphoto)PaidMediaPhoto

The paid media is a photo.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the paid media, always “photo” |
| photo | Array of [PhotoSize](https://core.telegram.org/bots/api#photosize) | The photo |

#### [](https://core.telegram.org/bots/api#paidmediavideo)PaidMediaVideo

The paid media is a video.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the paid media, always “video” |
| video | [Video](https://core.telegram.org/bots/api#video) | The video |

#### [](https://core.telegram.org/bots/api#contact)Contact

This object represents a phone contact.

| Field | Type | Description |
| --- | --- | --- |
| phone_number | String | Contact's phone number |
| first_name | String | Contact's first name |
| last_name | String | _Optional_. Contact's last name |
| user_id | Integer | _Optional_. Contact's user identifier in Telegram. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. |
| vcard | String | _Optional_. Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard) |

#### [](https://core.telegram.org/bots/api#dice)Dice

This object represents an animated emoji that displays a random value.

| Field | Type | Description |
| --- | --- | --- |
| emoji | String | Emoji on which the dice throw animation is based |
| value | Integer | Value of the dice, 1-6 for “”, “” and “” base emoji, 1-5 for “” and “” base emoji, 1-64 for “” base emoji |

#### [](https://core.telegram.org/bots/api#polloption)PollOption

This object contains information about one answer option in a poll.

| Field | Type | Description |
| --- | --- | --- |
| text | String | Option text, 1-100 characters |
| text_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. Special entities that appear in the option _text_. Currently, only custom emoji entities are allowed in poll option texts |
| voter_count | Integer | Number of users that voted for this option |

#### [](https://core.telegram.org/bots/api#inputpolloption)InputPollOption

This object contains information about one answer option in a poll to be sent.

| Field | Type | Description |
| --- | --- | --- |
| text | String | Option text, 1-100 characters |
| text_parse_mode | String | _Optional_. Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Currently, only custom emoji entities are allowed |
| text_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. A JSON-serialized list of special entities that appear in the poll option text. It can be specified instead of _text\_parse\_mode_ |

#### [](https://core.telegram.org/bots/api#pollanswer)PollAnswer

This object represents an answer of a user in a non-anonymous poll.

| Field | Type | Description |
| --- | --- | --- |
| poll_id | String | Unique poll identifier |
| voter_chat | [Chat](https://core.telegram.org/bots/api#chat) | _Optional_. The chat that changed the answer to the poll, if the voter is anonymous |
| user | [User](https://core.telegram.org/bots/api#user) | _Optional_. The user that changed the answer to the poll, if the voter isn't anonymous |
| option_ids | Array of Integer | 0-based identifiers of chosen answer options. May be empty if the vote was retracted. |

#### [](https://core.telegram.org/bots/api#poll)Poll

This object contains information about a poll.

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique poll identifier |
| question | String | Poll question, 1-300 characters |
| question_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. Special entities that appear in the _question_. Currently, only custom emoji entities are allowed in poll questions |
| options | Array of [PollOption](https://core.telegram.org/bots/api#polloption) | List of poll options |
| total_voter_count | Integer | Total number of users that voted in the poll |
| is_closed | Boolean | _True_, if the poll is closed |
| is_anonymous | Boolean | _True_, if the poll is anonymous |
| type | String | Poll type, currently can be “regular” or “quiz” |
| allows_multiple_answers | Boolean | _True_, if the poll allows multiple answers |
| correct_option_id | Integer | _Optional_. 0-based identifier of the correct answer option. Available only for polls in the quiz mode, which are closed, or was sent (not forwarded) by the bot or to the private chat with the bot. |
| explanation | String | _Optional_. Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters |
| explanation_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. Special entities like usernames, URLs, bot commands, etc. that appear in the _explanation_ |
| open_period | Integer | _Optional_. Amount of time in seconds the poll will be active after creation |
| close_date | Integer | _Optional_. Point in time (Unix timestamp) when the poll will be automatically closed |

#### [](https://core.telegram.org/bots/api#checklisttask)ChecklistTask

Describes a task in a checklist.

| Field | Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier of the task |
| text | String | Text of the task |
| text_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. Special entities that appear in the task text |
| completed_by_user | [User](https://core.telegram.org/bots/api#user) | _Optional_. User that completed the task; omitted if the task wasn't completed |
| completion_date | Integer | _Optional_. Point in time (Unix timestamp) when the task was completed; 0 if the task wasn't completed |

#### [](https://core.telegram.org/bots/api#checklist)Checklist

Describes a checklist.

| Field | Type | Description |
| --- | --- | --- |
| title | String | Title of the checklist |
| title_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. Special entities that appear in the checklist title |
| tasks | Array of [ChecklistTask](https://core.telegram.org/bots/api#checklisttask) | List of tasks in the checklist |
| others_can_add_tasks | True | _Optional_. _True_, if users other than the creator of the list can add tasks to the list |
| others_can_mark_tasks_as_done | True | _Optional_. _True_, if users other than the creator of the list can mark tasks as done or not done |

#### [](https://core.telegram.org/bots/api#inputchecklisttask)InputChecklistTask

Describes a task to add to a checklist.

| Field | Type | Description |
| --- | --- | --- |
| id | Integer | Unique identifier of the task; must be positive and unique among all task identifiers currently present in the checklist |
| text | String | Text of the task; 1-100 characters after entities parsing |
| parse_mode | String | Optional. Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| text_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the text, which can be specified instead of parse_mode. Currently, only _bold_, _italic_, _underline_, _strikethrough_, _spoiler_, and _custom\_emoji_ entities are allowed. |

#### [](https://core.telegram.org/bots/api#inputchecklist)InputChecklist

Describes a checklist to create.

| Field | Type | Description |
| --- | --- | --- |
| title | String | Title of the checklist; 1-255 characters after entities parsing |
| parse_mode | String | Optional. Mode for parsing entities in the title. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| title_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the title, which can be specified instead of parse_mode. Currently, only _bold_, _italic_, _underline_, _strikethrough_, _spoiler_, and _custom\_emoji_ entities are allowed. |
| tasks | Array of [InputChecklistTask](https://core.telegram.org/bots/api#inputchecklisttask) | List of 1-30 tasks in the checklist |
| others_can_add_tasks | Boolean | _Optional_. Pass _True_ if other users can add tasks to the checklist |
| others_can_mark_tasks_as_done | Boolean | _Optional_. Pass _True_ if other users can mark tasks as done or not done in the checklist |

#### [](https://core.telegram.org/bots/api#checklisttasksdone)ChecklistTasksDone

Describes a service message about checklist tasks marked as done or not done.

| Field | Type | Description |
| --- | --- | --- |
| checklist_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. Message containing the checklist whose tasks were marked as done or not done. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the _reply\_to\_message_ field even if it itself is a reply. |
| marked_as_done_task_ids | Array of Integer | _Optional_. Identifiers of the tasks that were marked as done |
| marked_as_not_done_task_ids | Array of Integer | _Optional_. Identifiers of the tasks that were marked as not done |

#### [](https://core.telegram.org/bots/api#checklisttasksadded)ChecklistTasksAdded

Describes a service message about tasks added to a checklist.

| Field | Type | Description |
| --- | --- | --- |
| checklist_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. Message containing the checklist to which the tasks were added. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the _reply\_to\_message_ field even if it itself is a reply. |
| tasks | Array of [ChecklistTask](https://core.telegram.org/bots/api#checklisttask) | List of tasks added to the checklist |

#### [](https://core.telegram.org/bots/api#location)Location

This object represents a point on the map.

| Field | Type | Description |
| --- | --- | --- |
| latitude | Float | Latitude as defined by the sender |
| longitude | Float | Longitude as defined by the sender |
| horizontal_accuracy | Float | _Optional_. The radius of uncertainty for the location, measured in meters; 0-1500 |
| live_period | Integer | _Optional_. Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only. |
| heading | Integer | _Optional_. The direction in which user is moving, in degrees; 1-360. For active live locations only. |
| proximity_alert_radius | Integer | _Optional_. The maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only. |

#### [](https://core.telegram.org/bots/api#venue)Venue

This object represents a venue.

| Field | Type | Description |
| --- | --- | --- |
| location | [Location](https://core.telegram.org/bots/api#location) | Venue location. Can't be a live location |
| title | String | Name of the venue |
| address | String | Address of the venue |
| foursquare_id | String | _Optional_. Foursquare identifier of the venue |
| foursquare_type | String | _Optional_. Foursquare type of the venue. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) |
| google_place_id | String | _Optional_. Google Places identifier of the venue |
| google_place_type | String | _Optional_. Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).) |

#### [](https://core.telegram.org/bots/api#webappdata)WebAppData

Describes data sent from a [Web App](https://core.telegram.org/bots/webapps) to the bot.

| Field | Type | Description |
| --- | --- | --- |
| data | String | The data. Be aware that a bad client can send arbitrary data in this field. |
| button_text | String | Text of the _web\_app_ keyboard button from which the Web App was opened. Be aware that a bad client can send arbitrary data in this field. |

#### [](https://core.telegram.org/bots/api#proximityalerttriggered)ProximityAlertTriggered

This object represents the content of a service message, sent whenever a user in the chat triggers a proximity alert set by another user.

| Field | Type | Description |
| --- | --- | --- |
| traveler | [User](https://core.telegram.org/bots/api#user) | User that triggered the alert |
| watcher | [User](https://core.telegram.org/bots/api#user) | User that set the alert |
| distance | Integer | The distance between the users |

#### [](https://core.telegram.org/bots/api#messageautodeletetimerchanged)MessageAutoDeleteTimerChanged

This object represents a service message about a change in auto-delete timer settings.

| Field | Type | Description |
| --- | --- | --- |
| message_auto_delete_time | Integer | New auto-delete time for messages in the chat; in seconds |

#### [](https://core.telegram.org/bots/api#chatboostadded)ChatBoostAdded

This object represents a service message about a user boosting a chat.

| Field | Type | Description |
| --- | --- | --- |
| boost_count | Integer | Number of boosts added by the user |

#### [](https://core.telegram.org/bots/api#backgroundfill)BackgroundFill

This object describes the way a background is filled based on the selected colors. Currently, it can be one of

*   [BackgroundFillSolid](https://core.telegram.org/bots/api#backgroundfillsolid)
*   [BackgroundFillGradient](https://core.telegram.org/bots/api#backgroundfillgradient)
*   [BackgroundFillFreeformGradient](https://core.telegram.org/bots/api#backgroundfillfreeformgradient)

#### [](https://core.telegram.org/bots/api#backgroundfillsolid)BackgroundFillSolid

The background is filled using the selected color.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the background fill, always “solid” |
| color | Integer | The color of the background fill in the RGB24 format |

#### [](https://core.telegram.org/bots/api#backgroundfillgradient)BackgroundFillGradient

The background is a gradient fill.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the background fill, always “gradient” |
| top_color | Integer | Top color of the gradient in the RGB24 format |
| bottom_color | Integer | Bottom color of the gradient in the RGB24 format |
| rotation_angle | Integer | Clockwise rotation angle of the background fill in degrees; 0-359 |

#### [](https://core.telegram.org/bots/api#backgroundfillfreeformgradient)BackgroundFillFreeformGradient

The background is a freeform gradient that rotates after every message in the chat.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the background fill, always “freeform_gradient” |
| colors | Array of Integer | A list of the 3 or 4 base colors that are used to generate the freeform gradient in the RGB24 format |

#### [](https://core.telegram.org/bots/api#backgroundtype)BackgroundType

This object describes the type of a background. Currently, it can be one of

*   [BackgroundTypeFill](https://core.telegram.org/bots/api#backgroundtypefill)
*   [BackgroundTypeWallpaper](https://core.telegram.org/bots/api#backgroundtypewallpaper)
*   [BackgroundTypePattern](https://core.telegram.org/bots/api#backgroundtypepattern)
*   [BackgroundTypeChatTheme](https://core.telegram.org/bots/api#backgroundtypechattheme)

#### [](https://core.telegram.org/bots/api#backgroundtypefill)BackgroundTypeFill

The background is automatically filled based on the selected colors.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the background, always “fill” |
| fill | [BackgroundFill](https://core.telegram.org/bots/api#backgroundfill) | The background fill |
| dark_theme_dimming | Integer | Dimming of the background in dark themes, as a percentage; 0-100 |

#### [](https://core.telegram.org/bots/api#backgroundtypewallpaper)BackgroundTypeWallpaper

The background is a wallpaper in the JPEG format.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the background, always “wallpaper” |
| document | [Document](https://core.telegram.org/bots/api#document) | Document with the wallpaper |
| dark_theme_dimming | Integer | Dimming of the background in dark themes, as a percentage; 0-100 |
| is_blurred | True | _Optional_. _True_, if the wallpaper is downscaled to fit in a 450x450 square and then box-blurred with radius 12 |
| is_moving | True | _Optional_. _True_, if the background moves slightly when the device is tilted |

#### [](https://core.telegram.org/bots/api#backgroundtypepattern)BackgroundTypePattern

The background is a .PNG or .TGV (gzipped subset of SVG with MIME type “application/x-tgwallpattern”) pattern to be combined with the background fill chosen by the user.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the background, always “pattern” |
| document | [Document](https://core.telegram.org/bots/api#document) | Document with the pattern |
| fill | [BackgroundFill](https://core.telegram.org/bots/api#backgroundfill) | The background fill that is combined with the pattern |
| intensity | Integer | Intensity of the pattern when it is shown above the filled background; 0-100 |
| is_inverted | True | _Optional_. _True_, if the background fill must be applied only to the pattern itself. All other pixels are black in this case. For dark themes only |
| is_moving | True | _Optional_. _True_, if the background moves slightly when the device is tilted |

#### [](https://core.telegram.org/bots/api#backgroundtypechattheme)BackgroundTypeChatTheme

The background is taken directly from a built-in chat theme.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the background, always “chat_theme” |
| theme_name | String | Name of the chat theme, which is usually an emoji |

#### [](https://core.telegram.org/bots/api#chatbackground)ChatBackground

This object represents a chat background.

| Field | Type | Description |
| --- | --- | --- |
| type | [BackgroundType](https://core.telegram.org/bots/api#backgroundtype) | Type of the background |

#### [](https://core.telegram.org/bots/api#forumtopiccreated)ForumTopicCreated

This object represents a service message about a new forum topic created in the chat.

| Field | Type | Description |
| --- | --- | --- |
| name | String | Name of the topic |
| icon_color | Integer | Color of the topic icon in RGB format |
| icon_custom_emoji_id | String | _Optional_. Unique identifier of the custom emoji shown as the topic icon |

#### [](https://core.telegram.org/bots/api#forumtopicclosed)ForumTopicClosed

This object represents a service message about a forum topic closed in the chat. Currently holds no information.

#### [](https://core.telegram.org/bots/api#forumtopicedited)ForumTopicEdited

This object represents a service message about an edited forum topic.

| Field | Type | Description |
| --- | --- | --- |
| name | String | _Optional_. New name of the topic, if it was edited |
| icon_custom_emoji_id | String | _Optional_. New identifier of the custom emoji shown as the topic icon, if it was edited; an empty string if the icon was removed |

#### [](https://core.telegram.org/bots/api#forumtopicreopened)ForumTopicReopened

This object represents a service message about a forum topic reopened in the chat. Currently holds no information.

#### [](https://core.telegram.org/bots/api#generalforumtopichidden)GeneralForumTopicHidden

This object represents a service message about General forum topic hidden in the chat. Currently holds no information.

#### [](https://core.telegram.org/bots/api#generalforumtopicunhidden)GeneralForumTopicUnhidden

This object represents a service message about General forum topic unhidden in the chat. Currently holds no information.

#### [](https://core.telegram.org/bots/api#shareduser)SharedUser

This object contains information about a user that was shared with the bot using a [KeyboardButtonRequestUsers](https://core.telegram.org/bots/api#keyboardbuttonrequestusers) button.

| Field | Type | Description |
| --- | --- | --- |
| user_id | Integer | Identifier of the shared user. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so 64-bit integers or double-precision float types are safe for storing these identifiers. The bot may not have access to the user and could be unable to use this identifier, unless the user is already known to the bot by some other means. |
| first_name | String | _Optional_. First name of the user, if the name was requested by the bot |
| last_name | String | _Optional_. Last name of the user, if the name was requested by the bot |
| username | String | _Optional_. Username of the user, if the username was requested by the bot |
| photo | Array of [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Available sizes of the chat photo, if the photo was requested by the bot |

#### [](https://core.telegram.org/bots/api#usersshared)UsersShared

This object contains information about the users whose identifiers were shared with the bot using a [KeyboardButtonRequestUsers](https://core.telegram.org/bots/api#keyboardbuttonrequestusers) button.

| Field | Type | Description |
| --- | --- | --- |
| request_id | Integer | Identifier of the request |
| users | Array of [SharedUser](https://core.telegram.org/bots/api#shareduser) | Information about users shared with the bot. |

#### [](https://core.telegram.org/bots/api#chatshared)ChatShared

This object contains information about a chat that was shared with the bot using a [KeyboardButtonRequestChat](https://core.telegram.org/bots/api#keyboardbuttonrequestchat) button.

| Field | Type | Description |
| --- | --- | --- |
| request_id | Integer | Identifier of the request |
| chat_id | Integer | Identifier of the shared chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot may not have access to the chat and could be unable to use this identifier, unless the chat is already known to the bot by some other means. |
| title | String | _Optional_. Title of the chat, if the title was requested by the bot. |
| username | String | _Optional_. Username of the chat, if the username was requested by the bot and available. |
| photo | Array of [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Available sizes of the chat photo, if the photo was requested by the bot |

#### [](https://core.telegram.org/bots/api#writeaccessallowed)WriteAccessAllowed

This object represents a service message about a user allowing a bot to write messages after adding it to the attachment menu, launching a Web App from a link, or accepting an explicit request from a Web App sent by the method [requestWriteAccess](https://core.telegram.org/bots/webapps#initializing-mini-apps).

| Field | Type | Description |
| --- | --- | --- |
| from_request | Boolean | _Optional_. _True_, if the access was granted after the user accepted an explicit request from a Web App sent by the method [requestWriteAccess](https://core.telegram.org/bots/webapps#initializing-mini-apps) |
| web_app_name | String | _Optional_. Name of the Web App, if the access was granted when the Web App was launched from a link |
| from_attachment_menu | Boolean | _Optional_. _True_, if the access was granted when the bot was added to the attachment or side menu |

#### [](https://core.telegram.org/bots/api#videochatscheduled)VideoChatScheduled

This object represents a service message about a video chat scheduled in the chat.

| Field | Type | Description |
| --- | --- | --- |
| start_date | Integer | Point in time (Unix timestamp) when the video chat is supposed to be started by a chat administrator |

#### [](https://core.telegram.org/bots/api#videochatstarted)VideoChatStarted

This object represents a service message about a video chat started in the chat. Currently holds no information.

#### [](https://core.telegram.org/bots/api#videochatended)VideoChatEnded

This object represents a service message about a video chat ended in the chat.

| Field | Type | Description |
| --- | --- | --- |
| duration | Integer | Video chat duration in seconds |

#### [](https://core.telegram.org/bots/api#videochatparticipantsinvited)VideoChatParticipantsInvited

This object represents a service message about new members invited to a video chat.

| Field | Type | Description |
| --- | --- | --- |
| users | Array of [User](https://core.telegram.org/bots/api#user) | New members that were invited to the video chat |

#### [](https://core.telegram.org/bots/api#paidmessagepricechanged)PaidMessagePriceChanged

Describes a service message about a change in the price of paid messages within a chat.

| Field | Type | Description |
| --- | --- | --- |
| paid_message_star_count | Integer | The new number of Telegram Stars that must be paid by non-administrator users of the supergroup chat for each sent message |

#### [](https://core.telegram.org/bots/api#directmessagepricechanged)DirectMessagePriceChanged

Describes a service message about a change in the price of direct messages sent to a channel chat.

| Field | Type | Description |
| --- | --- | --- |
| are_direct_messages_enabled | Boolean | _True_, if direct messages are enabled for the channel chat; false otherwise |
| direct_message_star_count | Integer | _Optional_. The new number of Telegram Stars that must be paid by users for each direct message sent to the channel. Does not apply to users who have been exempted by administrators. Defaults to 0. |

#### [](https://core.telegram.org/bots/api#suggestedpostapproved)SuggestedPostApproved

Describes a service message about the approval of a suggested post.

| Field | Type | Description |
| --- | --- | --- |
| suggested_post_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. Message containing the suggested post. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the _reply\_to\_message_ field even if it itself is a reply. |
| price | [SuggestedPostPrice](https://core.telegram.org/bots/api#suggestedpostprice) | _Optional_. Amount paid for the post |
| send_date | Integer | Date when the post will be published |

#### [](https://core.telegram.org/bots/api#suggestedpostapprovalfailed)SuggestedPostApprovalFailed

Describes a service message about the failed approval of a suggested post. Currently, only caused by insufficient user funds at the time of approval.

| Field | Type | Description |
| --- | --- | --- |
| suggested_post_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. Message containing the suggested post whose approval has failed. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the _reply\_to\_message_ field even if it itself is a reply. |
| price | [SuggestedPostPrice](https://core.telegram.org/bots/api#suggestedpostprice) | Expected price of the post |

#### [](https://core.telegram.org/bots/api#suggestedpostdeclined)SuggestedPostDeclined

Describes a service message about the rejection of a suggested post.

| Field | Type | Description |
| --- | --- | --- |
| suggested_post_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. Message containing the suggested post. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the _reply\_to\_message_ field even if it itself is a reply. |
| comment | String | _Optional_. Comment with which the post was declined |

#### [](https://core.telegram.org/bots/api#suggestedpostpaid)SuggestedPostPaid

Describes a service message about a successful payment for a suggested post.

| Field | Type | Description |
| --- | --- | --- |
| suggested_post_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. Message containing the suggested post. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the _reply\_to\_message_ field even if it itself is a reply. |
| currency | String | Currency in which the payment was made. Currently, one of “XTR” for Telegram Stars or “TON” for toncoins |
| amount | Integer | _Optional_. The amount of the currency that was received by the channel in nanotoncoins; for payments in toncoins only |
| star_amount | [StarAmount](https://core.telegram.org/bots/api#staramount) | _Optional_. The amount of Telegram Stars that was received by the channel; for payments in Telegram Stars only |

#### [](https://core.telegram.org/bots/api#suggestedpostrefunded)SuggestedPostRefunded

Describes a service message about a payment refund for a suggested post.

| Field | Type | Description |
| --- | --- | --- |
| suggested_post_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. Message containing the suggested post. Note that the [Message](https://core.telegram.org/bots/api#message) object in this field will not contain the _reply\_to\_message_ field even if it itself is a reply. |
| reason | String | Reason for the refund. Currently, one of “post_deleted” if the post was deleted within 24 hours of being posted or removed from scheduled messages without being posted, or “payment_refunded” if the payer refunded their payment. |

#### [](https://core.telegram.org/bots/api#giveawaycreated)GiveawayCreated

This object represents a service message about the creation of a scheduled giveaway.

| Field | Type | Description |
| --- | --- | --- |
| prize_star_count | Integer | _Optional_. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only |

#### [](https://core.telegram.org/bots/api#giveaway)Giveaway

This object represents a message about a scheduled giveaway.

| Field | Type | Description |
| --- | --- | --- |
| chats | Array of [Chat](https://core.telegram.org/bots/api#chat) | The list of chats which the user must join to participate in the giveaway |
| winners_selection_date | Integer | Point in time (Unix timestamp) when winners of the giveaway will be selected |
| winner_count | Integer | The number of users which are supposed to be selected as winners of the giveaway |
| only_new_members | True | _Optional_. _True_, if only users who join the chats after the giveaway started should be eligible to win |
| has_public_winners | True | _Optional_. _True_, if the list of giveaway winners will be visible to everyone |
| prize_description | String | _Optional_. Description of additional giveaway prize |
| country_codes | Array of String | _Optional_. A list of two-letter [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country codes indicating the countries from which eligible users for the giveaway must come. If empty, then all users can participate in the giveaway. Users with a phone number that was bought on Fragment can always participate in giveaways. |
| prize_star_count | Integer | _Optional_. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only |
| premium_subscription_month_count | Integer | _Optional_. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only |

#### [](https://core.telegram.org/bots/api#giveawaywinners)GiveawayWinners

This object represents a message about the completion of a giveaway with public winners.

| Field | Type | Description |
| --- | --- | --- |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | The chat that created the giveaway |
| giveaway_message_id | Integer | Identifier of the message with the giveaway in the chat |
| winners_selection_date | Integer | Point in time (Unix timestamp) when winners of the giveaway were selected |
| winner_count | Integer | Total number of winners in the giveaway |
| winners | Array of [User](https://core.telegram.org/bots/api#user) | List of up to 100 winners of the giveaway |
| additional_chat_count | Integer | _Optional_. The number of other chats the user had to join in order to be eligible for the giveaway |
| prize_star_count | Integer | _Optional_. The number of Telegram Stars that were split between giveaway winners; for Telegram Star giveaways only |
| premium_subscription_month_count | Integer | _Optional_. The number of months the Telegram Premium subscription won from the giveaway will be active for; for Telegram Premium giveaways only |
| unclaimed_prize_count | Integer | _Optional_. Number of undistributed prizes |
| only_new_members | True | _Optional_. _True_, if only users who had joined the chats after the giveaway started were eligible to win |
| was_refunded | True | _Optional_. _True_, if the giveaway was canceled because the payment for it was refunded |
| prize_description | String | _Optional_. Description of additional giveaway prize |

#### [](https://core.telegram.org/bots/api#giveawaycompleted)GiveawayCompleted

This object represents a service message about the completion of a giveaway without public winners.

| Field | Type | Description |
| --- | --- | --- |
| winner_count | Integer | Number of winners in the giveaway |
| unclaimed_prize_count | Integer | _Optional_. Number of undistributed prizes |
| giveaway_message | [Message](https://core.telegram.org/bots/api#message) | _Optional_. Message with the giveaway that was completed, if it wasn't deleted |
| is_star_giveaway | True | _Optional_. _True_, if the giveaway is a Telegram Star giveaway. Otherwise, currently, the giveaway is a Telegram Premium giveaway. |

#### [](https://core.telegram.org/bots/api#linkpreviewoptions)LinkPreviewOptions

Describes the options used for link preview generation.

| Field | Type | Description |
| --- | --- | --- |
| is_disabled | Boolean | _Optional_. _True_, if the link preview is disabled |
| url | String | _Optional_. URL to use for the link preview. If empty, then the first URL found in the message text will be used |
| prefer_small_media | Boolean | _Optional_. _True_, if the media in the link preview is supposed to be shrunk; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview |
| prefer_large_media | Boolean | _Optional_. _True_, if the media in the link preview is supposed to be enlarged; ignored if the URL isn't explicitly specified or media size change isn't supported for the preview |
| show_above_text | Boolean | _Optional_. _True_, if the link preview must be shown above the message text; otherwise, the link preview will be shown below the message text |

#### [](https://core.telegram.org/bots/api#suggestedpostprice)SuggestedPostPrice

Desribes price of a suggested post.

| Field | Type | Description |
| --- | --- | --- |
| currency | String | Currency in which the post will be paid. Currently, must be one of “XTR” for Telegram Stars or “TON” for toncoins |
| amount | Integer | The amount of the currency that will be paid for the post in the _smallest units_ of the currency, i.e. Telegram Stars or nanotoncoins. Currently, price in Telegram Stars must be between 5 and 100000, and price in nanotoncoins must be between 10000000 and 10000000000000. |

#### [](https://core.telegram.org/bots/api#suggestedpostinfo)SuggestedPostInfo

Contains information about a suggested post.

| Field | Type | Description |
| --- | --- | --- |
| state | String | State of the suggested post. Currently, it can be one of “pending”, “approved”, “declined”. |
| price | [SuggestedPostPrice](https://core.telegram.org/bots/api#suggestedpostprice) | _Optional_. Proposed price of the post. If the field is omitted, then the post is unpaid. |
| send_date | Integer | _Optional_. Proposed send date of the post. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user or administrator who approves it. |

#### [](https://core.telegram.org/bots/api#suggestedpostparameters)SuggestedPostParameters

Contains parameters of a post that is being suggested by the bot.

| Field | Type | Description |
| --- | --- | --- |
| price | [SuggestedPostPrice](https://core.telegram.org/bots/api#suggestedpostprice) | _Optional_. Proposed price for the post. If the field is omitted, then the post is unpaid. |
| send_date | Integer | _Optional_. Proposed send date of the post. If specified, then the date must be between 300 second and 2678400 seconds (30 days) in the future. If the field is omitted, then the post can be published at any time within 30 days at the sole discretion of the user who approves it. |

#### [](https://core.telegram.org/bots/api#directmessagestopic)DirectMessagesTopic

Describes a topic of a direct messages chat.

| Field | Type | Description |
| --- | --- | --- |
| topic_id | Integer | Unique identifier of the topic |
| user | [User](https://core.telegram.org/bots/api#user) | _Optional_. Information about the user that created the topic. Currently, it is always present |

#### [](https://core.telegram.org/bots/api#userprofilephotos)UserProfilePhotos

This object represent a user's profile pictures.

| Field | Type | Description |
| --- | --- | --- |
| total_count | Integer | Total number of profile pictures the target user has |
| photos | Array of Array of [PhotoSize](https://core.telegram.org/bots/api#photosize) | Requested profile pictures (in up to 4 sizes each) |

#### [](https://core.telegram.org/bots/api#file)File

This object represents a file ready to be downloaded. The file can be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling [getFile](https://core.telegram.org/bots/api#getfile).

> The maximum file size to download is 20 MB

| Field | Type | Description |
| --- | --- | --- |
| file_id | String | Identifier for this file, which can be used to download or reuse the file |
| file_unique_id | String | Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| file_size | Integer | _Optional_. File size in bytes. It can be bigger than 2^31 and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this value. |
| file_path | String | _Optional_. File path. Use `https://api.telegram.org/file/bot<token>/<file_path>` to get the file. |

#### [](https://core.telegram.org/bots/api#webappinfo)WebAppInfo

Describes a [Web App](https://core.telegram.org/bots/webapps).

| Field | Type | Description |
| --- | --- | --- |
| url | String | An HTTPS URL of a Web App to be opened with additional data as specified in [Initializing Web Apps](https://core.telegram.org/bots/webapps#initializing-mini-apps) |

#### [](https://core.telegram.org/bots/api#replykeyboardmarkup)ReplyKeyboardMarkup

This object represents a [custom keyboard](https://core.telegram.org/bots/features#keyboards) with reply options (see [Introduction to bots](https://core.telegram.org/bots/features#keyboards) for details and examples). Not supported in channels and for messages sent on behalf of a Telegram Business account.

| Field | Type | Description |
| --- | --- | --- |
| keyboard | Array of Array of [KeyboardButton](https://core.telegram.org/bots/api#keyboardbutton) | Array of button rows, each represented by an Array of [KeyboardButton](https://core.telegram.org/bots/api#keyboardbutton) objects |
| is_persistent | Boolean | _Optional_. Requests clients to always show the keyboard when the regular keyboard is hidden. Defaults to _false_, in which case the custom keyboard can be hidden and opened with a keyboard icon. |
| resize_keyboard | Boolean | _Optional_. Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to _false_, in which case the custom keyboard is always of the same height as the app's standard keyboard. |
| one_time_keyboard | Boolean | _Optional_. Requests clients to hide the keyboard as soon as it's been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat - the user can press a special button in the input field to see the custom keyboard again. Defaults to _false_. |
| input_field_placeholder | String | _Optional_. The placeholder to be shown in the input field when the keyboard is active; 1-64 characters |
| selective | Boolean | _Optional_. Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the _text_ of the [Message](https://core.telegram.org/bots/api#message) object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message. _Example:_ A user requests to change the bot's language, bot replies to the request with a keyboard to select the new language. Other users in the group don't see the keyboard. |

#### [](https://core.telegram.org/bots/api#keyboardbutton)KeyboardButton

This object represents one button of the reply keyboard. At most one of the optional fields must be used to specify type of the button. For simple text buttons, _String_ can be used instead of this object to specify the button text.

| Field | Type | Description |
| --- | --- | --- |
| text | String | Text of the button. If none of the optional fields are used, it will be sent as a message when the button is pressed |
| request_users | [KeyboardButtonRequestUsers](https://core.telegram.org/bots/api#keyboardbuttonrequestusers) | _Optional._ If specified, pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a “users_shared” service message. Available in private chats only. |
| request_chat | [KeyboardButtonRequestChat](https://core.telegram.org/bots/api#keyboardbuttonrequestchat) | _Optional._ If specified, pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a “chat_shared” service message. Available in private chats only. |
| request_contact | Boolean | _Optional_. If _True_, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only. |
| request_location | Boolean | _Optional_. If _True_, the user's current location will be sent when the button is pressed. Available in private chats only. |
| request_poll | [KeyboardButtonPollType](https://core.telegram.org/bots/api#keyboardbuttonpolltype) | _Optional_. If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only. |
| web_app | [WebAppInfo](https://core.telegram.org/bots/api#webappinfo) | _Optional_. If specified, the described [Web App](https://core.telegram.org/bots/webapps) will be launched when the button is pressed. The Web App will be able to send a “web_app_data” service message. Available in private chats only. |

**Note:**_request\_users_ and _request\_chat_ options will only work in Telegram versions released after 3 February, 2023. Older clients will display _unsupported message_.

#### [](https://core.telegram.org/bots/api#keyboardbuttonrequestusers)KeyboardButtonRequestUsers

This object defines the criteria used to request suitable users. Information about the selected users will be shared with the bot when the corresponding button is pressed. [More about requesting users »](https://core.telegram.org/bots/features#chat-and-user-selection)

| Field | Type | Description |
| --- | --- | --- |
| request_id | Integer | Signed 32-bit identifier of the request that will be received back in the [UsersShared](https://core.telegram.org/bots/api#usersshared) object. Must be unique within the message |
| user_is_bot | Boolean | _Optional_. Pass _True_ to request bots, pass _False_ to request regular users. If not specified, no additional restrictions are applied. |
| user_is_premium | Boolean | _Optional_. Pass _True_ to request premium users, pass _False_ to request non-premium users. If not specified, no additional restrictions are applied. |
| max_quantity | Integer | _Optional_. The maximum number of users to be selected; 1-10. Defaults to 1. |
| request_name | Boolean | _Optional_. Pass _True_ to request the users' first and last names |
| request_username | Boolean | _Optional_. Pass _True_ to request the users' usernames |
| request_photo | Boolean | _Optional_. Pass _True_ to request the users' photos |

#### [](https://core.telegram.org/bots/api#keyboardbuttonrequestchat)KeyboardButtonRequestChat

This object defines the criteria used to request a suitable chat. Information about the selected chat will be shared with the bot when the corresponding button is pressed. The bot will be granted requested rights in the chat if appropriate. [More about requesting chats »](https://core.telegram.org/bots/features#chat-and-user-selection).

| Field | Type | Description |
| --- | --- | --- |
| request_id | Integer | Signed 32-bit identifier of the request, which will be received back in the [ChatShared](https://core.telegram.org/bots/api#chatshared) object. Must be unique within the message |
| chat_is_channel | Boolean | Pass _True_ to request a channel chat, pass _False_ to request a group or a supergroup chat. |
| chat_is_forum | Boolean | _Optional_. Pass _True_ to request a forum supergroup, pass _False_ to request a non-forum chat. If not specified, no additional restrictions are applied. |
| chat_has_username | Boolean | _Optional_. Pass _True_ to request a supergroup or a channel with a username, pass _False_ to request a chat without a username. If not specified, no additional restrictions are applied. |
| chat_is_created | Boolean | _Optional_. Pass _True_ to request a chat owned by the user. Otherwise, no additional restrictions are applied. |
| user_administrator_rights | [ChatAdministratorRights](https://core.telegram.org/bots/api#chatadministratorrights) | _Optional_. A JSON-serialized object listing the required administrator rights of the user in the chat. The rights must be a superset of _bot\_administrator\_rights_. If not specified, no additional restrictions are applied. |
| bot_administrator_rights | [ChatAdministratorRights](https://core.telegram.org/bots/api#chatadministratorrights) | _Optional_. A JSON-serialized object listing the required administrator rights of the bot in the chat. The rights must be a subset of _user\_administrator\_rights_. If not specified, no additional restrictions are applied. |
| bot_is_member | Boolean | _Optional_. Pass _True_ to request a chat with the bot as a member. Otherwise, no additional restrictions are applied. |
| request_title | Boolean | _Optional_. Pass _True_ to request the chat's title |
| request_username | Boolean | _Optional_. Pass _True_ to request the chat's username |
| request_photo | Boolean | _Optional_. Pass _True_ to request the chat's photo |

#### [](https://core.telegram.org/bots/api#keyboardbuttonpolltype)KeyboardButtonPollType

This object represents type of a poll, which is allowed to be created and sent when the corresponding button is pressed.

| Field | Type | Description |
| --- | --- | --- |
| type | String | _Optional_. If _quiz_ is passed, the user will be allowed to create only polls in the quiz mode. If _regular_ is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of any type. |

#### [](https://core.telegram.org/bots/api#replykeyboardremove)ReplyKeyboardRemove

Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard. By default, custom keyboards are displayed until a new keyboard is sent by a bot. An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup)). Not supported in channels and for messages sent on behalf of a Telegram Business account.

| Field | Type | Description |
| --- | --- | --- |
| remove_keyboard | True | Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use _one\_time\_keyboard_ in [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup)) |
| selective | Boolean | _Optional_. Use this parameter if you want to remove the keyboard for specific users only. Targets: 1) users that are @mentioned in the _text_ of the [Message](https://core.telegram.org/bots/api#message) object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message. _Example:_ A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven't voted yet. |

#### [](https://core.telegram.org/bots/api#inlinekeyboardmarkup)InlineKeyboardMarkup

This object represents an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) that appears right next to the message it belongs to.

| Field | Type | Description |
| --- | --- | --- |
| inline_keyboard | Array of Array of [InlineKeyboardButton](https://core.telegram.org/bots/api#inlinekeyboardbutton) | Array of button rows, each represented by an Array of [InlineKeyboardButton](https://core.telegram.org/bots/api#inlinekeyboardbutton) objects |

#### [](https://core.telegram.org/bots/api#inlinekeyboardbutton)InlineKeyboardButton

This object represents one button of an inline keyboard. Exactly one of the optional fields must be used to specify type of the button.

| Field | Type | Description |
| --- | --- | --- |
| text | String | Label text on the button |
| url | String | _Optional_. HTTP or tg:// URL to be opened when the button is pressed. Links `tg://user?id=<user_id>` can be used to mention a user by their identifier without using a username, if this is allowed by their privacy settings. |
| callback_data | String | _Optional_. Data to be sent in a [callback query](https://core.telegram.org/bots/api#callbackquery) to the bot when the button is pressed, 1-64 bytes |
| web_app | [WebAppInfo](https://core.telegram.org/bots/api#webappinfo) | _Optional_. Description of the [Web App](https://core.telegram.org/bots/webapps) that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery). Available only in private chats between a user and the bot. Not supported for messages sent on behalf of a Telegram Business account. |
| login_url | [LoginUrl](https://core.telegram.org/bots/api#loginurl) | _Optional_. An HTTPS URL used to automatically authorize the user. Can be used as a replacement for the [Telegram Login Widget](https://core.telegram.org/widgets/login). |
| switch_inline_query | String | _Optional_. If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot's username and the specified inline query in the input field. May be empty, in which case just the bot's username will be inserted. Not supported for messages sent in channel direct messages chats and on behalf of a Telegram Business account. |
| switch_inline_query_current_chat | String | _Optional_. If set, pressing the button will insert the bot's username and the specified inline query in the current chat's input field. May be empty, in which case only the bot's username will be inserted. This offers a quick way for the user to open your bot in inline mode in the same chat - good for selecting something from multiple options. Not supported in channels and for messages sent in channel direct messages chats and on behalf of a Telegram Business account. |
| switch_inline_query_chosen_chat | [SwitchInlineQueryChosenChat](https://core.telegram.org/bots/api#switchinlinequerychosenchat) | _Optional_. If set, pressing the button will prompt the user to select one of their chats of the specified type, open that chat and insert the bot's username and the specified inline query in the input field. Not supported for messages sent in channel direct messages chats and on behalf of a Telegram Business account. |
| copy_text | [CopyTextButton](https://core.telegram.org/bots/api#copytextbutton) | _Optional_. Description of the button that copies the specified text to the clipboard. |
| callback_game | [CallbackGame](https://core.telegram.org/bots/api#callbackgame) | _Optional_. Description of the game that will be launched when the user presses the button. **NOTE:** This type of button **must** always be the first button in the first row. |
| pay | Boolean | _Optional_. Specify _True_, to send a [Pay button](https://core.telegram.org/bots/api#payments). Substrings “” and “XTR” in the buttons's text will be replaced with a Telegram Star icon. **NOTE:** This type of button **must** always be the first button in the first row and can only be used in invoice messages. |

#### [](https://core.telegram.org/bots/api#loginurl)LoginUrl

This object represents a parameter of the inline keyboard button used to automatically authorize a user. Serves as a great replacement for the [Telegram Login Widget](https://core.telegram.org/widgets/login) when the user is coming from Telegram. All the user needs to do is tap/click a button and confirm that they want to log in:

[](https://core.telegram.org/file/811140015/1734/8VZFkwWXalM.97872/6127fa62d8a0bf2b3c)

Telegram apps support these buttons as of [version 5.7](https://telegram.org/blog/privacy-discussions-web-bots#meet-seamless-web-bots).

> Sample bot: [@discussbot](https://t.me/discussbot)

| Field | Type | Description |
| --- | --- | --- |
| url | String | An HTTPS URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in [Receiving authorization data](https://core.telegram.org/widgets/login#receiving-authorization-data). **NOTE:** You **must** always check the hash of the received data to verify the authentication and the integrity of the data as described in [Checking authorization](https://core.telegram.org/widgets/login#checking-authorization). |
| forward_text | String | _Optional_. New text of the button in forwarded messages. |
| bot_username | String | _Optional_. Username of a bot, which will be used for user authorization. See [Setting up a bot](https://core.telegram.org/widgets/login#setting-up-a-bot) for more details. If not specified, the current bot's username will be assumed. The _url_'s domain must be the same as the domain linked with the bot. See [Linking your domain to the bot](https://core.telegram.org/widgets/login#linking-your-domain-to-the-bot) for more details. |
| request_write_access | Boolean | _Optional_. Pass _True_ to request the permission for your bot to send messages to the user. |

#### [](https://core.telegram.org/bots/api#switchinlinequerychosenchat)SwitchInlineQueryChosenChat

This object represents an inline button that switches the current user to inline mode in a chosen chat, with an optional default inline query.

| Field | Type | Description |
| --- | --- | --- |
| query | String | _Optional_. The default inline query to be inserted in the input field. If left empty, only the bot's username will be inserted |
| allow_user_chats | Boolean | _Optional_. _True_, if private chats with users can be chosen |
| allow_bot_chats | Boolean | _Optional_. _True_, if private chats with bots can be chosen |
| allow_group_chats | Boolean | _Optional_. _True_, if group and supergroup chats can be chosen |
| allow_channel_chats | Boolean | _Optional_. _True_, if channel chats can be chosen |

#### [](https://core.telegram.org/bots/api#copytextbutton)CopyTextButton

This object represents an inline keyboard button that copies specified text to the clipboard.

| Field | Type | Description |
| --- | --- | --- |
| text | String | The text to be copied to the clipboard; 1-256 characters |

#### [](https://core.telegram.org/bots/api#callbackquery)CallbackQuery

This object represents an incoming callback query from a callback button in an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). If the button that originated the query was attached to a message sent by the bot, the field _message_ will be present. If the button was attached to a message sent via the bot (in [inline mode](https://core.telegram.org/bots/api#inline-mode)), the field _inline\_message\_id_ will be present. Exactly one of the fields _data_ or _game\_short\_name_ will be present.

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique identifier for this query |
| from | [User](https://core.telegram.org/bots/api#user) | Sender |
| message | [MaybeInaccessibleMessage](https://core.telegram.org/bots/api#maybeinaccessiblemessage) | _Optional_. Message sent by the bot with the callback button that originated the query |
| inline_message_id | String | _Optional_. Identifier of the message sent via the bot in inline mode, that originated the query. |
| chat_instance | String | Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in [games](https://core.telegram.org/bots/api#games). |
| data | String | _Optional_. Data associated with the callback button. Be aware that the message originated the query can contain no callback buttons with this data. |
| game_short_name | String | _Optional_. Short name of a [Game](https://core.telegram.org/bots/api#games) to be returned, serves as the unique identifier for the game |

> **NOTE:** After the user presses a callback button, Telegram clients will display a progress bar until you call [answerCallbackQuery](https://core.telegram.org/bots/api#answercallbackquery). It is, therefore, necessary to react by calling [answerCallbackQuery](https://core.telegram.org/bots/api#answercallbackquery) even if no notification to the user is needed (e.g., without specifying any of the optional parameters).

#### [](https://core.telegram.org/bots/api#forcereply)ForceReply

Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot's message and tapped 'Reply'). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice [privacy mode](https://core.telegram.org/bots/features#privacy-mode). Not supported in channels and for messages sent on behalf of a Telegram Business account.

| Field | Type | Description |
| --- | --- | --- |
| force_reply | True | Shows reply interface to the user, as if they manually selected the bot's message and tapped 'Reply' |
| input_field_placeholder | String | _Optional_. The placeholder to be shown in the input field when the reply is active; 1-64 characters |
| selective | Boolean | _Optional_. Use this parameter if you want to force reply from specific users only. Targets: 1) users that are @mentioned in the _text_ of the [Message](https://core.telegram.org/bots/api#message) object; 2) if the bot's message is a reply to a message in the same chat and forum topic, sender of the original message. |

> **Example:** A [poll bot](https://t.me/PollBot) for groups runs in privacy mode (only receives commands, replies to its messages and mentions). There could be two ways to create a new poll:
> 
> 
> *   Explain the user how to send a command with parameters (e.g. /newpoll question answer1 answer2). May be appealing for hardcore users but lacks modern day polish.
> *   Guide the user through a step-by-step process. 'Please send me your question', 'Cool, now let's add the first answer option', 'Great. Keep adding answer options, then send /done when you're ready'.
> 
> 
> The last option is definitely more attractive. And if you use [ForceReply](https://core.telegram.org/bots/api#forcereply) in your bot's questions, it will receive the user's answers even if it only receives replies, commands and mentions - without any extra work for the user.

#### [](https://core.telegram.org/bots/api#chatphoto)ChatPhoto

This object represents a chat photo.

| Field | Type | Description |
| --- | --- | --- |
| small_file_id | String | File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed. |
| small_file_unique_id | String | Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| big_file_id | String | File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed. |
| big_file_unique_id | String | Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |

#### [](https://core.telegram.org/bots/api#chatinvitelink)ChatInviteLink

Represents an invite link for a chat.

| Field | Type | Description |
| --- | --- | --- |
| invite_link | String | The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with “…”. |
| creator | [User](https://core.telegram.org/bots/api#user) | Creator of the link |
| creates_join_request | Boolean | _True_, if users joining the chat via the link need to be approved by chat administrators |
| is_primary | Boolean | _True_, if the link is primary |
| is_revoked | Boolean | _True_, if the link is revoked |
| name | String | _Optional_. Invite link name |
| expire_date | Integer | _Optional_. Point in time (Unix timestamp) when the link will expire or has been expired |
| member_limit | Integer | _Optional_. The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 |
| pending_join_request_count | Integer | _Optional_. Number of pending join requests created using this link |
| subscription_period | Integer | _Optional_. The number of seconds the subscription will be active for before the next payment |
| subscription_price | Integer | _Optional_. The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat using the link |

#### [](https://core.telegram.org/bots/api#chatadministratorrights)ChatAdministratorRights

Represents the rights of an administrator in a chat.

| Field | Type | Description |
| --- | --- | --- |
| is_anonymous | Boolean | _True_, if the user's presence in the chat is hidden |
| can_manage_chat | Boolean | _True_, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege. |
| can_delete_messages | Boolean | _True_, if the administrator can delete messages of other users |
| can_manage_video_chats | Boolean | _True_, if the administrator can manage video chats |
| can_restrict_members | Boolean | _True_, if the administrator can restrict, ban or unban chat members, or access supergroup statistics |
| can_promote_members | Boolean | _True_, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user) |
| can_change_info | Boolean | _True_, if the user is allowed to change the chat title, photo and other settings |
| can_invite_users | Boolean | _True_, if the user is allowed to invite new users to the chat |
| can_post_stories | Boolean | _True_, if the administrator can post stories to the chat |
| can_edit_stories | Boolean | _True_, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive |
| can_delete_stories | Boolean | _True_, if the administrator can delete stories posted by other users |
| can_post_messages | Boolean | _Optional_. _True_, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only |
| can_edit_messages | Boolean | _Optional_. _True_, if the administrator can edit messages of other users and can pin messages; for channels only |
| can_pin_messages | Boolean | _Optional_. _True_, if the user is allowed to pin messages; for groups and supergroups only |
| can_manage_topics | Boolean | _Optional_. _True_, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only |
| can_manage_direct_messages | Boolean | _Optional_. _True_, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only |

#### [](https://core.telegram.org/bots/api#chatmemberupdated)ChatMemberUpdated

This object represents changes in the status of a chat member.

| Field | Type | Description |
| --- | --- | --- |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | Chat the user belongs to |
| from | [User](https://core.telegram.org/bots/api#user) | Performer of the action, which resulted in the change |
| date | Integer | Date the change was done in Unix time |
| old_chat_member | [ChatMember](https://core.telegram.org/bots/api#chatmember) | Previous information about the chat member |
| new_chat_member | [ChatMember](https://core.telegram.org/bots/api#chatmember) | New information about the chat member |
| invite_link | [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) | _Optional_. Chat invite link, which was used by the user to join the chat; for joining by invite link events only. |
| via_join_request | Boolean | _Optional_. _True_, if the user joined the chat after sending a direct join request without using an invite link and being approved by an administrator |
| via_chat_folder_invite_link | Boolean | _Optional_. _True_, if the user joined the chat via a chat folder invite link |

#### [](https://core.telegram.org/bots/api#chatmember)ChatMember

This object contains information about one member of a chat. Currently, the following 6 types of chat members are supported:

*   [ChatMemberOwner](https://core.telegram.org/bots/api#chatmemberowner)
*   [ChatMemberAdministrator](https://core.telegram.org/bots/api#chatmemberadministrator)
*   [ChatMemberMember](https://core.telegram.org/bots/api#chatmembermember)
*   [ChatMemberRestricted](https://core.telegram.org/bots/api#chatmemberrestricted)
*   [ChatMemberLeft](https://core.telegram.org/bots/api#chatmemberleft)
*   [ChatMemberBanned](https://core.telegram.org/bots/api#chatmemberbanned)

#### [](https://core.telegram.org/bots/api#chatmemberowner)ChatMemberOwner

Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that owns the chat and has all administrator privileges.

| Field | Type | Description |
| --- | --- | --- |
| status | String | The member's status in the chat, always “creator” |
| user | [User](https://core.telegram.org/bots/api#user) | Information about the user |
| is_anonymous | Boolean | _True_, if the user's presence in the chat is hidden |
| custom_title | String | _Optional_. Custom title for this user |

#### [](https://core.telegram.org/bots/api#chatmemberadministrator)ChatMemberAdministrator

Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that has some additional privileges.

| Field | Type | Description |
| --- | --- | --- |
| status | String | The member's status in the chat, always “administrator” |
| user | [User](https://core.telegram.org/bots/api#user) | Information about the user |
| can_be_edited | Boolean | _True_, if the bot is allowed to edit administrator privileges of that user |
| is_anonymous | Boolean | _True_, if the user's presence in the chat is hidden |
| can_manage_chat | Boolean | _True_, if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege. |
| can_delete_messages | Boolean | _True_, if the administrator can delete messages of other users |
| can_manage_video_chats | Boolean | _True_, if the administrator can manage video chats |
| can_restrict_members | Boolean | _True_, if the administrator can restrict, ban or unban chat members, or access supergroup statistics |
| can_promote_members | Boolean | _True_, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by the user) |
| can_change_info | Boolean | _True_, if the user is allowed to change the chat title, photo and other settings |
| can_invite_users | Boolean | _True_, if the user is allowed to invite new users to the chat |
| can_post_stories | Boolean | _True_, if the administrator can post stories to the chat |
| can_edit_stories | Boolean | _True_, if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive |
| can_delete_stories | Boolean | _True_, if the administrator can delete stories posted by other users |
| can_post_messages | Boolean | _Optional_. _True_, if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only |
| can_edit_messages | Boolean | _Optional_. _True_, if the administrator can edit messages of other users and can pin messages; for channels only |
| can_pin_messages | Boolean | _Optional_. _True_, if the user is allowed to pin messages; for groups and supergroups only |
| can_manage_topics | Boolean | _Optional_. _True_, if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only |
| can_manage_direct_messages | Boolean | _Optional_. _True_, if the administrator can manage direct messages of the channel and decline suggested posts; for channels only |
| custom_title | String | _Optional_. Custom title for this user |

#### [](https://core.telegram.org/bots/api#chatmembermember)ChatMemberMember

Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that has no additional privileges or restrictions.

| Field | Type | Description |
| --- | --- | --- |
| status | String | The member's status in the chat, always “member” |
| user | [User](https://core.telegram.org/bots/api#user) | Information about the user |
| until_date | Integer | _Optional_. Date when the user's subscription will expire; Unix time |

#### [](https://core.telegram.org/bots/api#chatmemberrestricted)ChatMemberRestricted

Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that is under certain restrictions in the chat. Supergroups only.

| Field | Type | Description |
| --- | --- | --- |
| status | String | The member's status in the chat, always “restricted” |
| user | [User](https://core.telegram.org/bots/api#user) | Information about the user |
| is_member | Boolean | _True_, if the user is a member of the chat at the moment of the request |
| can_send_messages | Boolean | _True_, if the user is allowed to send text messages, contacts, giveaways, giveaway winners, invoices, locations and venues |
| can_send_audios | Boolean | _True_, if the user is allowed to send audios |
| can_send_documents | Boolean | _True_, if the user is allowed to send documents |
| can_send_photos | Boolean | _True_, if the user is allowed to send photos |
| can_send_videos | Boolean | _True_, if the user is allowed to send videos |
| can_send_video_notes | Boolean | _True_, if the user is allowed to send video notes |
| can_send_voice_notes | Boolean | _True_, if the user is allowed to send voice notes |
| can_send_polls | Boolean | _True_, if the user is allowed to send polls and checklists |
| can_send_other_messages | Boolean | _True_, if the user is allowed to send animations, games, stickers and use inline bots |
| can_add_web_page_previews | Boolean | _True_, if the user is allowed to add web page previews to their messages |
| can_change_info | Boolean | _True_, if the user is allowed to change the chat title, photo and other settings |
| can_invite_users | Boolean | _True_, if the user is allowed to invite new users to the chat |
| can_pin_messages | Boolean | _True_, if the user is allowed to pin messages |
| can_manage_topics | Boolean | _True_, if the user is allowed to create forum topics |
| until_date | Integer | Date when restrictions will be lifted for this user; Unix time. If 0, then the user is restricted forever |

#### [](https://core.telegram.org/bots/api#chatmemberleft)ChatMemberLeft

Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that isn't currently a member of the chat, but may join it themselves.

| Field | Type | Description |
| --- | --- | --- |
| status | String | The member's status in the chat, always “left” |
| user | [User](https://core.telegram.org/bots/api#user) | Information about the user |

#### [](https://core.telegram.org/bots/api#chatmemberbanned)ChatMemberBanned

Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that was banned in the chat and can't return to the chat or view chat messages.

| Field | Type | Description |
| --- | --- | --- |
| status | String | The member's status in the chat, always “kicked” |
| user | [User](https://core.telegram.org/bots/api#user) | Information about the user |
| until_date | Integer | Date when restrictions will be lifted for this user; Unix time. If 0, then the user is banned forever |

#### [](https://core.telegram.org/bots/api#chatjoinrequest)ChatJoinRequest

Represents a join request sent to a chat.

| Field | Type | Description |
| --- | --- | --- |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | Chat to which the request was sent |
| from | [User](https://core.telegram.org/bots/api#user) | User that sent the join request |
| user_chat_id | Integer | Identifier of a private chat with the user who sent the join request. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. The bot can use this identifier for 5 minutes to send messages until the join request is processed, assuming no other administrator contacted the user. |
| date | Integer | Date the request was sent in Unix time |
| bio | String | _Optional_. Bio of the user. |
| invite_link | [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) | _Optional_. Chat invite link that was used by the user to send the join request |

#### [](https://core.telegram.org/bots/api#chatpermissions)ChatPermissions

Describes actions that a non-administrator user is allowed to take in a chat.

| Field | Type | Description |
| --- | --- | --- |
| can_send_messages | Boolean | _Optional_. _True_, if the user is allowed to send text messages, contacts, giveaways, giveaway winners, invoices, locations and venues |
| can_send_audios | Boolean | _Optional_. _True_, if the user is allowed to send audios |
| can_send_documents | Boolean | _Optional_. _True_, if the user is allowed to send documents |
| can_send_photos | Boolean | _Optional_. _True_, if the user is allowed to send photos |
| can_send_videos | Boolean | _Optional_. _True_, if the user is allowed to send videos |
| can_send_video_notes | Boolean | _Optional_. _True_, if the user is allowed to send video notes |
| can_send_voice_notes | Boolean | _Optional_. _True_, if the user is allowed to send voice notes |
| can_send_polls | Boolean | _Optional_. _True_, if the user is allowed to send polls and checklists |
| can_send_other_messages | Boolean | _Optional_. _True_, if the user is allowed to send animations, games, stickers and use inline bots |
| can_add_web_page_previews | Boolean | _Optional_. _True_, if the user is allowed to add web page previews to their messages |
| can_change_info | Boolean | _Optional_. _True_, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups |
| can_invite_users | Boolean | _Optional_. _True_, if the user is allowed to invite new users to the chat |
| can_pin_messages | Boolean | _Optional_. _True_, if the user is allowed to pin messages. Ignored in public supergroups |
| can_manage_topics | Boolean | _Optional_. _True_, if the user is allowed to create forum topics. If omitted defaults to the value of can_pin_messages |

#### [](https://core.telegram.org/bots/api#birthdate)Birthdate

Describes the birthdate of a user.

| Field | Type | Description |
| --- | --- | --- |
| day | Integer | Day of the user's birth; 1-31 |
| month | Integer | Month of the user's birth; 1-12 |
| year | Integer | _Optional_. Year of the user's birth |

#### [](https://core.telegram.org/bots/api#businessintro)BusinessIntro

Contains information about the start page settings of a Telegram Business account.

| Field | Type | Description |
| --- | --- | --- |
| title | String | _Optional_. Title text of the business intro |
| message | String | _Optional_. Message text of the business intro |
| sticker | [Sticker](https://core.telegram.org/bots/api#sticker) | _Optional_. Sticker of the business intro |

#### [](https://core.telegram.org/bots/api#businesslocation)BusinessLocation

Contains information about the location of a Telegram Business account.

| Field | Type | Description |
| --- | --- | --- |
| address | String | Address of the business |
| location | [Location](https://core.telegram.org/bots/api#location) | _Optional_. Location of the business |

#### [](https://core.telegram.org/bots/api#businessopeninghoursinterval)BusinessOpeningHoursInterval

Describes an interval of time during which a business is open.

| Field | Type | Description |
| --- | --- | --- |
| opening_minute | Integer | The minute's sequence number in a week, starting on Monday, marking the start of the time interval during which the business is open; 0 - 7 * 24 * 60 |
| closing_minute | Integer | The minute's sequence number in a week, starting on Monday, marking the end of the time interval during which the business is open; 0 - 8 * 24 * 60 |

#### [](https://core.telegram.org/bots/api#businessopeninghours)BusinessOpeningHours

Describes the opening hours of a business.

| Field | Type | Description |
| --- | --- | --- |
| time_zone_name | String | Unique name of the time zone for which the opening hours are defined |
| opening_hours | Array of [BusinessOpeningHoursInterval](https://core.telegram.org/bots/api#businessopeninghoursinterval) | List of time intervals describing business opening hours |

#### [](https://core.telegram.org/bots/api#storyareaposition)StoryAreaPosition

Describes the position of a clickable area within a story.

| Field | Type | Description |
| --- | --- | --- |
| x_percentage | Float | The abscissa of the area's center, as a percentage of the media width |
| y_percentage | Float | The ordinate of the area's center, as a percentage of the media height |
| width_percentage | Float | The width of the area's rectangle, as a percentage of the media width |
| height_percentage | Float | The height of the area's rectangle, as a percentage of the media height |
| rotation_angle | Float | The clockwise rotation angle of the rectangle, in degrees; 0-360 |
| corner_radius_percentage | Float | The radius of the rectangle corner rounding, as a percentage of the media width |

#### [](https://core.telegram.org/bots/api#locationaddress)LocationAddress

Describes the physical address of a location.

| Field | Type | Description |
| --- | --- | --- |
| country_code | String | The two-letter ISO 3166-1 alpha-2 country code of the country where the location is located |
| state | String | _Optional_. State of the location |
| city | String | _Optional_. City of the location |
| street | String | _Optional_. Street address of the location |

#### [](https://core.telegram.org/bots/api#storyareatype)StoryAreaType

Describes the type of a clickable area on a story. Currently, it can be one of

*   [StoryAreaTypeLocation](https://core.telegram.org/bots/api#storyareatypelocation)
*   [StoryAreaTypeSuggestedReaction](https://core.telegram.org/bots/api#storyareatypesuggestedreaction)
*   [StoryAreaTypeLink](https://core.telegram.org/bots/api#storyareatypelink)
*   [StoryAreaTypeWeather](https://core.telegram.org/bots/api#storyareatypeweather)
*   [StoryAreaTypeUniqueGift](https://core.telegram.org/bots/api#storyareatypeuniquegift)

#### [](https://core.telegram.org/bots/api#storyareatypelocation)StoryAreaTypeLocation

Describes a story area pointing to a location. Currently, a story can have up to 10 location areas.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the area, always “location” |
| latitude | Float | Location latitude in degrees |
| longitude | Float | Location longitude in degrees |
| address | [LocationAddress](https://core.telegram.org/bots/api#locationaddress) | _Optional_. Address of the location |

#### [](https://core.telegram.org/bots/api#storyareatypesuggestedreaction)StoryAreaTypeSuggestedReaction

Describes a story area pointing to a suggested reaction. Currently, a story can have up to 5 suggested reaction areas.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the area, always “suggested_reaction” |
| reaction_type | [ReactionType](https://core.telegram.org/bots/api#reactiontype) | Type of the reaction |
| is_dark | Boolean | _Optional_. Pass _True_ if the reaction area has a dark background |
| is_flipped | Boolean | _Optional_. Pass _True_ if reaction area corner is flipped |

#### [](https://core.telegram.org/bots/api#storyareatypelink)StoryAreaTypeLink

Describes a story area pointing to an HTTP or tg:// link. Currently, a story can have up to 3 link areas.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the area, always “link” |
| url | String | HTTP or tg:// URL to be opened when the area is clicked |

#### [](https://core.telegram.org/bots/api#storyareatypeweather)StoryAreaTypeWeather

Describes a story area containing weather information. Currently, a story can have up to 3 weather areas.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the area, always “weather” |
| temperature | Float | Temperature, in degree Celsius |
| emoji | String | Emoji representing the weather |
| background_color | Integer | A color of the area background in the ARGB format |

#### [](https://core.telegram.org/bots/api#storyareatypeuniquegift)StoryAreaTypeUniqueGift

Describes a story area pointing to a unique gift. Currently, a story can have at most 1 unique gift area.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the area, always “unique_gift” |
| name | String | Unique name of the gift |

#### [](https://core.telegram.org/bots/api#storyarea)StoryArea

Describes a clickable area on a story media.

| Field | Type | Description |
| --- | --- | --- |
| position | [StoryAreaPosition](https://core.telegram.org/bots/api#storyareaposition) | Position of the area |
| type | [StoryAreaType](https://core.telegram.org/bots/api#storyareatype) | Type of the area |

#### [](https://core.telegram.org/bots/api#chatlocation)ChatLocation

Represents a location to which a chat is connected.

| Field | Type | Description |
| --- | --- | --- |
| location | [Location](https://core.telegram.org/bots/api#location) | The location to which the supergroup is connected. Can't be a live location. |
| address | String | Location address; 1-64 characters, as defined by the chat owner |

#### [](https://core.telegram.org/bots/api#reactiontype)ReactionType

This object describes the type of a reaction. Currently, it can be one of

*   [ReactionTypeEmoji](https://core.telegram.org/bots/api#reactiontypeemoji)
*   [ReactionTypeCustomEmoji](https://core.telegram.org/bots/api#reactiontypecustomemoji)
*   [ReactionTypePaid](https://core.telegram.org/bots/api#reactiontypepaid)

#### [](https://core.telegram.org/bots/api#reactiontypeemoji)ReactionTypeEmoji

The reaction is based on an emoji.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the reaction, always “emoji” |
| emoji | String | Reaction emoji. Currently, it can be one of "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" |

#### [](https://core.telegram.org/bots/api#reactiontypecustomemoji)ReactionTypeCustomEmoji

The reaction is based on a custom emoji.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the reaction, always “custom_emoji” |
| custom_emoji_id | String | Custom emoji identifier |

#### [](https://core.telegram.org/bots/api#reactiontypepaid)ReactionTypePaid

The reaction is paid.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the reaction, always “paid” |

#### [](https://core.telegram.org/bots/api#reactioncount)ReactionCount

Represents a reaction added to a message along with the number of times it was added.

| Field | Type | Description |
| --- | --- | --- |
| type | [ReactionType](https://core.telegram.org/bots/api#reactiontype) | Type of the reaction |
| total_count | Integer | Number of times the reaction was added |

#### [](https://core.telegram.org/bots/api#messagereactionupdated)MessageReactionUpdated

This object represents a change of a reaction on a message performed by a user.

| Field | Type | Description |
| --- | --- | --- |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | The chat containing the message the user reacted to |
| message_id | Integer | Unique identifier of the message inside the chat |
| user | [User](https://core.telegram.org/bots/api#user) | _Optional_. The user that changed the reaction, if the user isn't anonymous |
| actor_chat | [Chat](https://core.telegram.org/bots/api#chat) | _Optional_. The chat on behalf of which the reaction was changed, if the user is anonymous |
| date | Integer | Date of the change in Unix time |
| old_reaction | Array of [ReactionType](https://core.telegram.org/bots/api#reactiontype) | Previous list of reaction types that were set by the user |
| new_reaction | Array of [ReactionType](https://core.telegram.org/bots/api#reactiontype) | New list of reaction types that have been set by the user |

#### [](https://core.telegram.org/bots/api#messagereactioncountupdated)MessageReactionCountUpdated

This object represents reaction changes on a message with anonymous reactions.

| Field | Type | Description |
| --- | --- | --- |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | The chat containing the message |
| message_id | Integer | Unique message identifier inside the chat |
| date | Integer | Date of the change in Unix time |
| reactions | Array of [ReactionCount](https://core.telegram.org/bots/api#reactioncount) | List of reactions that are present on the message |

#### [](https://core.telegram.org/bots/api#forumtopic)ForumTopic

This object represents a forum topic.

| Field | Type | Description |
| --- | --- | --- |
| message_thread_id | Integer | Unique identifier of the forum topic |
| name | String | Name of the topic |
| icon_color | Integer | Color of the topic icon in RGB format |
| icon_custom_emoji_id | String | _Optional_. Unique identifier of the custom emoji shown as the topic icon |

#### [](https://core.telegram.org/bots/api#gift)Gift

This object represents a gift that can be sent by the bot.

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique identifier of the gift |
| sticker | [Sticker](https://core.telegram.org/bots/api#sticker) | The sticker that represents the gift |
| star_count | Integer | The number of Telegram Stars that must be paid to send the sticker |
| upgrade_star_count | Integer | _Optional_. The number of Telegram Stars that must be paid to upgrade the gift to a unique one |
| total_count | Integer | _Optional_. The total number of the gifts of this type that can be sent; for limited gifts only |
| remaining_count | Integer | _Optional_. The number of remaining gifts of this type that can be sent; for limited gifts only |
| publisher_chat | [Chat](https://core.telegram.org/bots/api#chat) | _Optional_. Information about the chat that published the gift |

#### [](https://core.telegram.org/bots/api#gifts)Gifts

This object represent a list of gifts.

| Field | Type | Description |
| --- | --- | --- |
| gifts | Array of [Gift](https://core.telegram.org/bots/api#gift) | The list of gifts |

#### [](https://core.telegram.org/bots/api#uniquegiftmodel)UniqueGiftModel

This object describes the model of a unique gift.

| Field | Type | Description |
| --- | --- | --- |
| name | String | Name of the model |
| sticker | [Sticker](https://core.telegram.org/bots/api#sticker) | The sticker that represents the unique gift |
| rarity_per_mille | Integer | The number of unique gifts that receive this model for every 1000 gifts upgraded |

#### [](https://core.telegram.org/bots/api#uniquegiftsymbol)UniqueGiftSymbol

This object describes the symbol shown on the pattern of a unique gift.

| Field | Type | Description |
| --- | --- | --- |
| name | String | Name of the symbol |
| sticker | [Sticker](https://core.telegram.org/bots/api#sticker) | The sticker that represents the unique gift |
| rarity_per_mille | Integer | The number of unique gifts that receive this model for every 1000 gifts upgraded |

#### [](https://core.telegram.org/bots/api#uniquegiftbackdropcolors)UniqueGiftBackdropColors

This object describes the colors of the backdrop of a unique gift.

| Field | Type | Description |
| --- | --- | --- |
| center_color | Integer | The color in the center of the backdrop in RGB format |
| edge_color | Integer | The color on the edges of the backdrop in RGB format |
| symbol_color | Integer | The color to be applied to the symbol in RGB format |
| text_color | Integer | The color for the text on the backdrop in RGB format |

#### [](https://core.telegram.org/bots/api#uniquegiftbackdrop)UniqueGiftBackdrop

This object describes the backdrop of a unique gift.

| Field | Type | Description |
| --- | --- | --- |
| name | String | Name of the backdrop |
| colors | [UniqueGiftBackdropColors](https://core.telegram.org/bots/api#uniquegiftbackdropcolors) | Colors of the backdrop |
| rarity_per_mille | Integer | The number of unique gifts that receive this backdrop for every 1000 gifts upgraded |

#### [](https://core.telegram.org/bots/api#uniquegift)UniqueGift

This object describes a unique gift that was upgraded from a regular gift.

| Field | Type | Description |
| --- | --- | --- |
| base_name | String | Human-readable name of the regular gift from which this unique gift was upgraded |
| name | String | Unique name of the gift. This name can be used in `https://t.me/nft/...` links and story areas |
| number | Integer | Unique number of the upgraded gift among gifts upgraded from the same regular gift |
| model | [UniqueGiftModel](https://core.telegram.org/bots/api#uniquegiftmodel) | Model of the gift |
| symbol | [UniqueGiftSymbol](https://core.telegram.org/bots/api#uniquegiftsymbol) | Symbol of the gift |
| backdrop | [UniqueGiftBackdrop](https://core.telegram.org/bots/api#uniquegiftbackdrop) | Backdrop of the gift |
| publisher_chat | [Chat](https://core.telegram.org/bots/api#chat) | _Optional_. Information about the chat that published the gift |

#### [](https://core.telegram.org/bots/api#giftinfo)GiftInfo

Describes a service message about a regular gift that was sent or received.

| Field | Type | Description |
| --- | --- | --- |
| gift | [Gift](https://core.telegram.org/bots/api#gift) | Information about the gift |
| owned_gift_id | String | _Optional_. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts |
| convert_star_count | Integer | _Optional_. Number of Telegram Stars that can be claimed by the receiver by converting the gift; omitted if conversion to Telegram Stars is impossible |
| prepaid_upgrade_star_count | Integer | _Optional_. Number of Telegram Stars that were prepaid by the sender for the ability to upgrade the gift |
| can_be_upgraded | True | _Optional_. _True_, if the gift can be upgraded to a unique gift |
| text | String | _Optional_. Text of the message that was added to the gift |
| entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. Special entities that appear in the text |
| is_private | True | _Optional_. _True_, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them |

#### [](https://core.telegram.org/bots/api#uniquegiftinfo)UniqueGiftInfo

Describes a service message about a unique gift that was sent or received.

| Field | Type | Description |
| --- | --- | --- |
| gift | [UniqueGift](https://core.telegram.org/bots/api#uniquegift) | Information about the gift |
| origin | String | Origin of the gift. Currently, either “upgrade” for gifts upgraded from regular gifts, “transfer” for gifts transferred from other users or channels, or “resale” for gifts bought from other users |
| last_resale_star_count | Integer | _Optional_. For gifts bought from other users, the price paid for the gift |
| owned_gift_id | String | _Optional_. Unique identifier of the received gift for the bot; only present for gifts received on behalf of business accounts |
| transfer_star_count | Integer | _Optional_. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift |
| next_transfer_date | Integer | _Optional_. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now |

#### [](https://core.telegram.org/bots/api#ownedgift)OwnedGift

This object describes a gift received and owned by a user or a chat. Currently, it can be one of

*   [OwnedGiftRegular](https://core.telegram.org/bots/api#ownedgiftregular)
*   [OwnedGiftUnique](https://core.telegram.org/bots/api#ownedgiftunique)

#### [](https://core.telegram.org/bots/api#ownedgiftregular)OwnedGiftRegular

Describes a regular gift owned by a user or a chat.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the gift, always “regular” |
| gift | [Gift](https://core.telegram.org/bots/api#gift) | Information about the regular gift |
| owned_gift_id | String | _Optional_. Unique identifier of the gift for the bot; for gifts received on behalf of business accounts only |
| sender_user | [User](https://core.telegram.org/bots/api#user) | _Optional_. Sender of the gift if it is a known user |
| send_date | Integer | Date the gift was sent in Unix time |
| text | String | _Optional_. Text of the message that was added to the gift |
| entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. Special entities that appear in the text |
| is_private | True | _Optional_. _True_, if the sender and gift text are shown only to the gift receiver; otherwise, everyone will be able to see them |
| is_saved | True | _Optional_. _True_, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only |
| can_be_upgraded | True | _Optional_. _True_, if the gift can be upgraded to a unique gift; for gifts received on behalf of business accounts only |
| was_refunded | True | _Optional_. _True_, if the gift was refunded and isn't available anymore |
| convert_star_count | Integer | _Optional_. Number of Telegram Stars that can be claimed by the receiver instead of the gift; omitted if the gift cannot be converted to Telegram Stars |
| prepaid_upgrade_star_count | Integer | _Optional_. Number of Telegram Stars that were paid by the sender for the ability to upgrade the gift |

#### [](https://core.telegram.org/bots/api#ownedgiftunique)OwnedGiftUnique

Describes a unique gift received and owned by a user or a chat.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the gift, always “unique” |
| gift | [UniqueGift](https://core.telegram.org/bots/api#uniquegift) | Information about the unique gift |
| owned_gift_id | String | _Optional_. Unique identifier of the received gift for the bot; for gifts received on behalf of business accounts only |
| sender_user | [User](https://core.telegram.org/bots/api#user) | _Optional_. Sender of the gift if it is a known user |
| send_date | Integer | Date the gift was sent in Unix time |
| is_saved | True | _Optional_. _True_, if the gift is displayed on the account's profile page; for gifts received on behalf of business accounts only |
| can_be_transferred | True | _Optional_. _True_, if the gift can be transferred to another owner; for gifts received on behalf of business accounts only |
| transfer_star_count | Integer | _Optional_. Number of Telegram Stars that must be paid to transfer the gift; omitted if the bot cannot transfer the gift |
| next_transfer_date | Integer | _Optional_. Point in time (Unix timestamp) when the gift can be transferred. If it is in the past, then the gift can be transferred now |

#### [](https://core.telegram.org/bots/api#ownedgifts)OwnedGifts

Contains the list of gifts received and owned by a user or a chat.

| Field | Type | Description |
| --- | --- | --- |
| total_count | Integer | The total number of gifts owned by the user or the chat |
| gifts | Array of [OwnedGift](https://core.telegram.org/bots/api#ownedgift) | The list of gifts |
| next_offset | String | _Optional_. Offset for the next request. If empty, then there are no more results |

#### [](https://core.telegram.org/bots/api#acceptedgifttypes)AcceptedGiftTypes

This object describes the types of gifts that can be gifted to a user or a chat.

| Field | Type | Description |
| --- | --- | --- |
| unlimited_gifts | Boolean | _True_, if unlimited regular gifts are accepted |
| limited_gifts | Boolean | _True_, if limited regular gifts are accepted |
| unique_gifts | Boolean | _True_, if unique gifts or gifts that can be upgraded to unique for free are accepted |
| premium_subscription | Boolean | _True_, if a Telegram Premium subscription is accepted |

#### [](https://core.telegram.org/bots/api#staramount)StarAmount

Describes an amount of Telegram Stars.

| Field | Type | Description |
| --- | --- | --- |
| amount | Integer | Integer amount of Telegram Stars, rounded to 0; can be negative |
| nanostar_amount | Integer | _Optional_. The number of 1/1000000000 shares of Telegram Stars; from -999999999 to 999999999; can be negative if and only if _amount_ is non-positive |

#### [](https://core.telegram.org/bots/api#botcommand)BotCommand

This object represents a bot command.

| Field | Type | Description |
| --- | --- | --- |
| command | String | Text of the command; 1-32 characters. Can contain only lowercase English letters, digits and underscores. |
| description | String | Description of the command; 1-256 characters. |

#### [](https://core.telegram.org/bots/api#botcommandscope)BotCommandScope

This object represents the scope to which bot commands are applied. Currently, the following 7 scopes are supported:

*   [BotCommandScopeDefault](https://core.telegram.org/bots/api#botcommandscopedefault)
*   [BotCommandScopeAllPrivateChats](https://core.telegram.org/bots/api#botcommandscopeallprivatechats)
*   [BotCommandScopeAllGroupChats](https://core.telegram.org/bots/api#botcommandscopeallgroupchats)
*   [BotCommandScopeAllChatAdministrators](https://core.telegram.org/bots/api#botcommandscopeallchatadministrators)
*   [BotCommandScopeChat](https://core.telegram.org/bots/api#botcommandscopechat)
*   [BotCommandScopeChatAdministrators](https://core.telegram.org/bots/api#botcommandscopechatadministrators)
*   [BotCommandScopeChatMember](https://core.telegram.org/bots/api#botcommandscopechatmember)

#### [](https://core.telegram.org/bots/api#determining-list-of-commands)Determining list of commands

The following algorithm is used to determine the list of commands for a particular user viewing the bot menu. The first list of commands which is set is returned:

**Commands in the chat with the bot**

*   botCommandScopeChat + language_code
*   botCommandScopeChat
*   botCommandScopeAllPrivateChats + language_code
*   botCommandScopeAllPrivateChats
*   botCommandScopeDefault + language_code
*   botCommandScopeDefault

**Commands in group and supergroup chats**

*   botCommandScopeChatMember + language_code
*   botCommandScopeChatMember
*   botCommandScopeChatAdministrators + language_code (administrators only)
*   botCommandScopeChatAdministrators (administrators only)
*   botCommandScopeChat + language_code
*   botCommandScopeChat
*   botCommandScopeAllChatAdministrators + language_code (administrators only)
*   botCommandScopeAllChatAdministrators (administrators only)
*   botCommandScopeAllGroupChats + language_code
*   botCommandScopeAllGroupChats
*   botCommandScopeDefault + language_code
*   botCommandScopeDefault

#### [](https://core.telegram.org/bots/api#botcommandscopedefault)BotCommandScopeDefault

Represents the default [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands. Default commands are used if no commands with a [narrower scope](https://core.telegram.org/bots/api#determining-list-of-commands) are specified for the user.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Scope type, must be _default_ |

#### [](https://core.telegram.org/bots/api#botcommandscopeallprivatechats)BotCommandScopeAllPrivateChats

Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering all private chats.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Scope type, must be _all\_private\_chats_ |

#### [](https://core.telegram.org/bots/api#botcommandscopeallgroupchats)BotCommandScopeAllGroupChats

Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering all group and supergroup chats.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Scope type, must be _all\_group\_chats_ |

#### [](https://core.telegram.org/bots/api#botcommandscopeallchatadministrators)BotCommandScopeAllChatAdministrators

Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering all group and supergroup chat administrators.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Scope type, must be _all\_chat\_administrators_ |

#### [](https://core.telegram.org/bots/api#botcommandscopechat)BotCommandScopeChat

Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering a specific chat.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Scope type, must be _chat_ |
| chat_id | Integer or String | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel direct messages chats and channel chats aren't supported. |

#### [](https://core.telegram.org/bots/api#botcommandscopechatadministrators)BotCommandScopeChatAdministrators

Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering all administrators of a specific group or supergroup chat.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Scope type, must be _chat\_administrators_ |
| chat_id | Integer or String | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel direct messages chats and channel chats aren't supported. |

#### [](https://core.telegram.org/bots/api#botcommandscopechatmember)BotCommandScopeChatMember

Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering a specific member of a group or supergroup chat.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Scope type, must be _chat\_member_ |
| chat_id | Integer or String | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel direct messages chats and channel chats aren't supported. |
| user_id | Integer | Unique identifier of the target user |

#### [](https://core.telegram.org/bots/api#botname)BotName

This object represents the bot's name.

| Field | Type | Description |
| --- | --- | --- |
| name | String | The bot's name |

#### [](https://core.telegram.org/bots/api#botdescription)BotDescription

This object represents the bot's description.

| Field | Type | Description |
| --- | --- | --- |
| description | String | The bot's description |

#### [](https://core.telegram.org/bots/api#botshortdescription)BotShortDescription

This object represents the bot's short description.

| Field | Type | Description |
| --- | --- | --- |
| short_description | String | The bot's short description |

#### [](https://core.telegram.org/bots/api#menubutton)MenuButton

This object describes the bot's menu button in a private chat. It should be one of

*   [MenuButtonCommands](https://core.telegram.org/bots/api#menubuttoncommands)
*   [MenuButtonWebApp](https://core.telegram.org/bots/api#menubuttonwebapp)
*   [MenuButtonDefault](https://core.telegram.org/bots/api#menubuttondefault)

If a menu button other than [MenuButtonDefault](https://core.telegram.org/bots/api#menubuttondefault) is set for a private chat, then it is applied in the chat. Otherwise the default menu button is applied. By default, the menu button opens the list of bot commands.

#### [](https://core.telegram.org/bots/api#menubuttoncommands)MenuButtonCommands

Represents a menu button, which opens the bot's list of commands.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the button, must be _commands_ |

#### [](https://core.telegram.org/bots/api#menubuttonwebapp)MenuButtonWebApp

Represents a menu button, which launches a [Web App](https://core.telegram.org/bots/webapps).

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the button, must be _web\_app_ |
| text | String | Text on the button |
| web_app | [WebAppInfo](https://core.telegram.org/bots/api#webappinfo) | Description of the Web App that will be launched when the user presses the button. The Web App will be able to send an arbitrary message on behalf of the user using the method [answerWebAppQuery](https://core.telegram.org/bots/api#answerwebappquery). Alternatively, a `t.me` link to a Web App of the bot can be specified in the object instead of the Web App's URL, in which case the Web App will be opened as if the user pressed the link. |

#### [](https://core.telegram.org/bots/api#menubuttondefault)MenuButtonDefault

Describes that no specific value for the menu button was set.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the button, must be _default_ |

#### [](https://core.telegram.org/bots/api#chatboostsource)ChatBoostSource

This object describes the source of a chat boost. It can be one of

*   [ChatBoostSourcePremium](https://core.telegram.org/bots/api#chatboostsourcepremium)
*   [ChatBoostSourceGiftCode](https://core.telegram.org/bots/api#chatboostsourcegiftcode)
*   [ChatBoostSourceGiveaway](https://core.telegram.org/bots/api#chatboostsourcegiveaway)

#### [](https://core.telegram.org/bots/api#chatboostsourcepremium)ChatBoostSourcePremium

The boost was obtained by subscribing to Telegram Premium or by gifting a Telegram Premium subscription to another user.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Source of the boost, always “premium” |
| user | [User](https://core.telegram.org/bots/api#user) | User that boosted the chat |

#### [](https://core.telegram.org/bots/api#chatboostsourcegiftcode)ChatBoostSourceGiftCode

The boost was obtained by the creation of Telegram Premium gift codes to boost a chat. Each such code boosts the chat 4 times for the duration of the corresponding Telegram Premium subscription.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Source of the boost, always “gift_code” |
| user | [User](https://core.telegram.org/bots/api#user) | User for which the gift code was created |

#### [](https://core.telegram.org/bots/api#chatboostsourcegiveaway)ChatBoostSourceGiveaway

The boost was obtained by the creation of a Telegram Premium or a Telegram Star giveaway. This boosts the chat 4 times for the duration of the corresponding Telegram Premium subscription for Telegram Premium giveaways and _prize\_star\_count_ / 500 times for one year for Telegram Star giveaways.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Source of the boost, always “giveaway” |
| giveaway_message_id | Integer | Identifier of a message in the chat with the giveaway; the message could have been deleted already. May be 0 if the message isn't sent yet. |
| user | [User](https://core.telegram.org/bots/api#user) | _Optional_. User that won the prize in the giveaway if any; for Telegram Premium giveaways only |
| prize_star_count | Integer | _Optional_. The number of Telegram Stars to be split between giveaway winners; for Telegram Star giveaways only |
| is_unclaimed | True | _Optional_. _True_, if the giveaway was completed, but there was no user to win the prize |

#### [](https://core.telegram.org/bots/api#chatboost)ChatBoost

This object contains information about a chat boost.

| Field | Type | Description |
| --- | --- | --- |
| boost_id | String | Unique identifier of the boost |
| add_date | Integer | Point in time (Unix timestamp) when the chat was boosted |
| expiration_date | Integer | Point in time (Unix timestamp) when the boost will automatically expire, unless the booster's Telegram Premium subscription is prolonged |
| source | [ChatBoostSource](https://core.telegram.org/bots/api#chatboostsource) | Source of the added boost |

#### [](https://core.telegram.org/bots/api#chatboostupdated)ChatBoostUpdated

This object represents a boost added to a chat or changed.

| Field | Type | Description |
| --- | --- | --- |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | Chat which was boosted |
| boost | [ChatBoost](https://core.telegram.org/bots/api#chatboost) | Information about the chat boost |

#### [](https://core.telegram.org/bots/api#chatboostremoved)ChatBoostRemoved

This object represents a boost removed from a chat.

| Field | Type | Description |
| --- | --- | --- |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | Chat which was boosted |
| boost_id | String | Unique identifier of the boost |
| remove_date | Integer | Point in time (Unix timestamp) when the boost was removed |
| source | [ChatBoostSource](https://core.telegram.org/bots/api#chatboostsource) | Source of the removed boost |

#### [](https://core.telegram.org/bots/api#userchatboosts)UserChatBoosts

This object represents a list of boosts added to a chat by a user.

| Field | Type | Description |
| --- | --- | --- |
| boosts | Array of [ChatBoost](https://core.telegram.org/bots/api#chatboost) | The list of boosts added to the chat by the user |

#### [](https://core.telegram.org/bots/api#businessbotrights)BusinessBotRights

Represents the rights of a business bot.

| Field | Type | Description |
| --- | --- | --- |
| can_reply | True | _Optional_. _True_, if the bot can send and edit messages in the private chats that had incoming messages in the last 24 hours |
| can_read_messages | True | _Optional_. _True_, if the bot can mark incoming private messages as read |
| can_delete_sent_messages | True | _Optional_. _True_, if the bot can delete messages sent by the bot |
| can_delete_all_messages | True | _Optional_. _True_, if the bot can delete all private messages in managed chats |
| can_edit_name | True | _Optional_. _True_, if the bot can edit the first and last name of the business account |
| can_edit_bio | True | _Optional_. _True_, if the bot can edit the bio of the business account |
| can_edit_profile_photo | True | _Optional_. _True_, if the bot can edit the profile photo of the business account |
| can_edit_username | True | _Optional_. _True_, if the bot can edit the username of the business account |
| can_change_gift_settings | True | _Optional_. _True_, if the bot can change the privacy settings pertaining to gifts for the business account |
| can_view_gifts_and_stars | True | _Optional_. _True_, if the bot can view gifts and the amount of Telegram Stars owned by the business account |
| can_convert_gifts_to_stars | True | _Optional_. _True_, if the bot can convert regular gifts owned by the business account to Telegram Stars |
| can_transfer_and_upgrade_gifts | True | _Optional_. _True_, if the bot can transfer and upgrade gifts owned by the business account |
| can_transfer_stars | True | _Optional_. _True_, if the bot can transfer Telegram Stars received by the business account to its own account, or use them to upgrade and transfer gifts |
| can_manage_stories | True | _Optional_. _True_, if the bot can post, edit and delete stories on behalf of the business account |

#### [](https://core.telegram.org/bots/api#businessconnection)BusinessConnection

Describes the connection of the bot with a business account.

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique identifier of the business connection |
| user | [User](https://core.telegram.org/bots/api#user) | Business account user that created the business connection |
| user_chat_id | Integer | Identifier of a private chat with the user who created the business connection. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. |
| date | Integer | Date the connection was established in Unix time |
| rights | [BusinessBotRights](https://core.telegram.org/bots/api#businessbotrights) | _Optional_. Rights of the business bot |
| is_enabled | Boolean | _True_, if the connection is active |

#### [](https://core.telegram.org/bots/api#businessmessagesdeleted)BusinessMessagesDeleted

This object is received when messages are deleted from a connected business account.

| Field | Type | Description |
| --- | --- | --- |
| business_connection_id | String | Unique identifier of the business connection |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | Information about a chat in the business account. The bot may not have access to the chat or the corresponding user. |
| message_ids | Array of Integer | The list of identifiers of deleted messages in the chat of the business account |

#### [](https://core.telegram.org/bots/api#responseparameters)ResponseParameters

Describes why a request was unsuccessful.

| Field | Type | Description |
| --- | --- | --- |
| migrate_to_chat_id | Integer | _Optional_. The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. |
| retry_after | Integer | _Optional_. In case of exceeding flood control, the number of seconds left to wait before the request can be repeated |

#### [](https://core.telegram.org/bots/api#inputmedia)InputMedia

This object represents the content of a media message to be sent. It should be one of

*   [InputMediaAnimation](https://core.telegram.org/bots/api#inputmediaanimation)
*   [InputMediaDocument](https://core.telegram.org/bots/api#inputmediadocument)
*   [InputMediaAudio](https://core.telegram.org/bots/api#inputmediaaudio)
*   [InputMediaPhoto](https://core.telegram.org/bots/api#inputmediaphoto)
*   [InputMediaVideo](https://core.telegram.org/bots/api#inputmediavideo)

#### [](https://core.telegram.org/bots/api#inputmediaphoto)InputMediaPhoto

Represents a photo to be sent.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _photo_ |
| media | String | File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| caption | String | _Optional_. Caption of the photo to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| has_spoiler | Boolean | _Optional_. Pass _True_ if the photo needs to be covered with a spoiler animation |

#### [](https://core.telegram.org/bots/api#inputmediavideo)InputMediaVideo

Represents a video to be sent.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _video_ |
| media | String | File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| thumbnail | String | _Optional_. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| cover | String | _Optional_. Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| start_timestamp | Integer | _Optional_. Start timestamp for the video in the message |
| caption | String | _Optional_. Caption of the video to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| width | Integer | _Optional_. Video width |
| height | Integer | _Optional_. Video height |
| duration | Integer | _Optional_. Video duration in seconds |
| supports_streaming | Boolean | _Optional_. Pass _True_ if the uploaded video is suitable for streaming |
| has_spoiler | Boolean | _Optional_. Pass _True_ if the video needs to be covered with a spoiler animation |

#### [](https://core.telegram.org/bots/api#inputmediaanimation)InputMediaAnimation

Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _animation_ |
| media | String | File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| thumbnail | String | _Optional_. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| caption | String | _Optional_. Caption of the animation to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the animation caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| width | Integer | _Optional_. Animation width |
| height | Integer | _Optional_. Animation height |
| duration | Integer | _Optional_. Animation duration in seconds |
| has_spoiler | Boolean | _Optional_. Pass _True_ if the animation needs to be covered with a spoiler animation |

#### [](https://core.telegram.org/bots/api#inputmediaaudio)InputMediaAudio

Represents an audio file to be treated as music to be sent.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _audio_ |
| media | String | File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| thumbnail | String | _Optional_. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| caption | String | _Optional_. Caption of the audio to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the audio caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| duration | Integer | _Optional_. Duration of the audio in seconds |
| performer | String | _Optional_. Performer of the audio |
| title | String | _Optional_. Title of the audio |

#### [](https://core.telegram.org/bots/api#inputmediadocument)InputMediaDocument

Represents a general file to be sent.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _document_ |
| media | String | File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| thumbnail | String | _Optional_. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| caption | String | _Optional_. Caption of the document to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| disable_content_type_detection | Boolean | _Optional_. Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always _True_, if the document is sent as part of an album. |

#### [](https://core.telegram.org/bots/api#inputfile)InputFile

This object represents the contents of a file to be uploaded. Must be posted using multipart/form-data in the usual way that files are uploaded via the browser.

#### [](https://core.telegram.org/bots/api#inputpaidmedia)InputPaidMedia

This object describes the paid media to be sent. Currently, it can be one of

*   [InputPaidMediaPhoto](https://core.telegram.org/bots/api#inputpaidmediaphoto)
*   [InputPaidMediaVideo](https://core.telegram.org/bots/api#inputpaidmediavideo)

#### [](https://core.telegram.org/bots/api#inputpaidmediaphoto)InputPaidMediaPhoto

The paid media to send is a photo.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the media, must be _photo_ |
| media | String | File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |

#### [](https://core.telegram.org/bots/api#inputpaidmediavideo)InputPaidMediaVideo

The paid media to send is a video.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the media, must be _video_ |
| media | String | File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| thumbnail | String | _Optional_. Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| cover | String | _Optional_. Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| start_timestamp | Integer | _Optional_. Start timestamp for the video in the message |
| width | Integer | _Optional_. Video width |
| height | Integer | _Optional_. Video height |
| duration | Integer | _Optional_. Video duration in seconds |
| supports_streaming | Boolean | _Optional_. Pass _True_ if the uploaded video is suitable for streaming |

#### [](https://core.telegram.org/bots/api#inputprofilephoto)InputProfilePhoto

This object describes a profile photo to set. Currently, it can be one of

*   [InputProfilePhotoStatic](https://core.telegram.org/bots/api#inputprofilephotostatic)
*   [InputProfilePhotoAnimated](https://core.telegram.org/bots/api#inputprofilephotoanimated)

#### [](https://core.telegram.org/bots/api#inputprofilephotostatic)InputProfilePhotoStatic

A static profile photo in the .JPG format.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the profile photo, must be _static_ |
| photo | String | The static profile photo. Profile photos can't be reused and can only be uploaded as a new file, so you can pass “attach://<file_attach_name>” if the photo was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |

#### [](https://core.telegram.org/bots/api#inputprofilephotoanimated)InputProfilePhotoAnimated

An animated profile photo in the MPEG4 format.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the profile photo, must be _animated_ |
| animation | String | The animated profile photo. Profile photos can't be reused and can only be uploaded as a new file, so you can pass “attach://<file_attach_name>” if the photo was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| main_frame_timestamp | Float | _Optional_. Timestamp in seconds of the frame that will be used as the static profile photo. Defaults to 0.0. |

#### [](https://core.telegram.org/bots/api#inputstorycontent)InputStoryContent

This object describes the content of a story to post. Currently, it can be one of

*   [InputStoryContentPhoto](https://core.telegram.org/bots/api#inputstorycontentphoto)
*   [InputStoryContentVideo](https://core.telegram.org/bots/api#inputstorycontentvideo)

#### [](https://core.telegram.org/bots/api#inputstorycontentphoto)InputStoryContentPhoto

Describes a photo to post as a story.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the content, must be _photo_ |
| photo | String | The photo to post as a story. The photo must be of the size 1080x1920 and must not exceed 10 MB. The photo can't be reused and can only be uploaded as a new file, so you can pass “attach://<file_attach_name>” if the photo was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |

#### [](https://core.telegram.org/bots/api#inputstorycontentvideo)InputStoryContentVideo

Describes a video to post as a story.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the content, must be _video_ |
| video | String | The video to post as a story. The video must be of the size 720x1280, streamable, encoded with H.265 codec, with key frames added each second in the MPEG4 format, and must not exceed 30 MB. The video can't be reused and can only be uploaded as a new file, so you can pass “attach://<file_attach_name>” if the video was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| duration | Float | _Optional_. Precise duration of the video in seconds; 0-60 |
| cover_frame_timestamp | Float | _Optional_. Timestamp in seconds of the frame that will be used as the static cover for the story. Defaults to 0.0. |
| is_animation | Boolean | _Optional_. Pass _True_ if the video has no sound |

#### [](https://core.telegram.org/bots/api#sending-files)Sending files

There are three ways to send files (photos, stickers, audio, media, etc.):

1.   If the file is already stored somewhere on the Telegram servers, you don't need to reupload it: each file object has a **file_id** field, simply pass this **file_id** as a parameter instead of uploading. There are **no limits** for files sent this way.
2.   Provide Telegram with an HTTP URL for the file to be sent. Telegram will download and send the file. 5 MB max size for photos and 20 MB max for other types of content.
3.   Post the file using multipart/form-data in the usual way that files are uploaded via the browser. 10 MB max size for photos, 50 MB for other files.

**Sending by file_id**

*   It is not possible to change the file type when resending by **file_id**. I.e. a [video](https://core.telegram.org/bots/api#video) can't be [sent as a photo](https://core.telegram.org/bots/api#sendphoto), a [photo](https://core.telegram.org/bots/api#photosize) can't be [sent as a document](https://core.telegram.org/bots/api#senddocument), etc.
*   It is not possible to resend thumbnails.
*   Resending a photo by **file_id** will send all of its [sizes](https://core.telegram.org/bots/api#photosize).
*   **file_id** is unique for each individual bot and **can't** be transferred from one bot to another.
*   **file_id** uniquely identifies a file, but a file can have different valid **file_id**s even for the same bot.

**Sending by URL**

*   When sending by URL the target file must have the correct MIME type (e.g., audio/mpeg for [sendAudio](https://core.telegram.org/bots/api#sendaudio), etc.).
*   In [sendDocument](https://core.telegram.org/bots/api#senddocument), sending by URL will currently only work for **.PDF** and **.ZIP** files.
*   To use [sendVoice](https://core.telegram.org/bots/api#sendvoice), the file must have the type audio/ogg and be no more than 1MB in size. 1-20MB voice notes will be sent as files.
*   Other configurations may work but we can't guarantee that they will.

#### [](https://core.telegram.org/bots/api#accent-colors)Accent colors

Colors with identifiers 0 (red), 1 (orange), 2 (purple/violet), 3 (green), 4 (cyan), 5 (blue), 6 (pink) can be customized by app themes. Additionally, the following colors in RGB format are currently in use.

| Color identifier | Light colors | Dark colors |
| --- | --- | --- |
| 7 | E15052 F9AE63 | FF9380 992F37 |
| 8 | E0802B FAC534 | ECB04E C35714 |
| 9 | A05FF3 F48FFF | C697FF 5E31C8 |
| 10 | 27A910 A7DC57 | A7EB6E 167E2D |
| 11 | 27ACCE 82E8D6 | 40D8D0 045C7F |
| 12 | 3391D4 7DD3F0 | 52BFFF 0B5494 |
| 13 | DD4371 FFBE9F | FF86A6 8E366E |
| 14 | 247BED F04856 FFFFFF | 3FA2FE E5424F FFFFFF |
| 15 | D67722 1EA011 FFFFFF | FF905E 32A527 FFFFFF |
| 16 | 179E42 E84A3F FFFFFF | 66D364 D5444F FFFFFF |
| 17 | 2894AF 6FC456 FFFFFF | 22BCE2 3DA240 FFFFFF |
| 18 | 0C9AB3 FFAD95 FFE6B5 | 22BCE2 FF9778 FFDA6B |
| 19 | 7757D6 F79610 FFDE8E | 9791FF F2731D FFDB59 |
| 20 | 1585CF F2AB1D FFFFFF | 3DA6EB EEA51D FFFFFF |

#### [](https://core.telegram.org/bots/api#profile-accent-colors)Profile accent colors

Currently, the following colors in RGB format are in use for profile backgrounds.

| Color identifier | Light colors | Dark colors |
| --- | --- | --- |
| 0 | BA5650 | 9C4540 |
| 1 | C27C3E | 945E2C |
| 2 | 956AC8 | 715099 |
| 3 | 49A355 | 33713B |
| 4 | 3E97AD | 387E87 |
| 5 | 5A8FBB | 477194 |
| 6 | B85378 | 944763 |
| 7 | 7F8B95 | 435261 |
| 8 | C9565D D97C57 | 994343 AC583E |
| 9 | CF7244 CC9433 | 8F552F A17232 |
| 10 | 9662D4 B966B6 | 634691 9250A2 |
| 11 | 3D9755 89A650 | 296A43 5F8F44 |
| 12 | 3D95BA 50AD98 | 306C7C 3E987E |
| 13 | 538BC2 4DA8BD | 38618C 458BA1 |
| 14 | B04F74 D1666D | 884160 A65259 |
| 15 | 637482 7B8A97 | 53606E 384654 |

#### [](https://core.telegram.org/bots/api#inline-mode-objects)Inline mode objects

Objects and methods used in the inline mode are described in the [Inline mode section](https://core.telegram.org/bots/api#inline-mode).

### [](https://core.telegram.org/bots/api#available-methods)Available methods

> All methods in the Bot API are case-insensitive. We support **GET** and **POST** HTTP methods. Use either [URL query string](https://en.wikipedia.org/wiki/Query_string) or _application/json_ or _application/x-www-form-urlencoded_ or _multipart/form-data_ for passing parameters in Bot API requests.
> 
> On successful call, a JSON-object containing the result will be returned.

#### [](https://core.telegram.org/bots/api#getme)getMe

A simple method for testing your bot's authentication token. Requires no parameters. Returns basic information about the bot in form of a [User](https://core.telegram.org/bots/api#user) object.

#### [](https://core.telegram.org/bots/api#logout)logOut

Use this method to log out from the cloud Bot API server before launching the bot locally. You **must** log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns _True_ on success. Requires no parameters.

#### [](https://core.telegram.org/bots/api#close)close

Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn't launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns _True_ on success. Requires no parameters.

#### [](https://core.telegram.org/bots/api#sendmessage)sendMessage

Use this method to send text messages. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| text | String | Yes | Text of the message to be sent, 1-4096 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in message text, which can be specified instead of _parse\_mode_ |
| link_preview_options | [LinkPreviewOptions](https://core.telegram.org/bots/api#linkpreviewoptions) | Optional | Link preview generation options for the message |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#formatting-options)Formatting options

The Bot API supports basic formatting for messages. You can use bold, italic, underlined, strikethrough, spoiler text, block quotations as well as inline links and pre-formatted code in your bots' messages. Telegram clients will render them accordingly. You can specify text entities directly, or use markdown-style or HTML-style formatting.

Note that Telegram clients will display an **alert** to the user before opening an inline link ('Open this link?' together with the full URL).

Message entities can be nested, providing following restrictions are met:

- If two entities have common characters, then one of them is fully contained inside another.

- _bold_, _italic_, _underline_, _strikethrough_, and _spoiler_ entities can contain and can be part of any other entities, except _pre_ and _code_.

- _blockquote_ and _expandable\_blockquote_ entities can't be nested.

- All other entities can't contain each other.

Links `tg://user?id=<user_id>` can be used to mention a user by their identifier without using a username. Please note:

*   These links will work **only** if they are used inside an inline link or in an inline keyboard button. For example, they will not work, when used in a message text.
*   Unless the user is a member of the chat where they were mentioned, these mentions are only guaranteed to work if the user has contacted the bot in private in the past or has sent a callback query to the bot via an inline button and doesn't have Forwarded Messages privacy enabled for the bot.

You can find the list of programming and markup languages for which syntax highlighting is supported at [libprisma#supported-languages](https://github.com/TelegramMessenger/libprisma#supported-languages).

###### [](https://core.telegram.org/bots/api#markdownv2-style)MarkdownV2 style

To use this mode, pass _MarkdownV2_ in the _parse\_mode_ field. Use the following syntax in your message:

```
*bold \*text*
_italic \*text_
__underline__
~strikethrough~
||spoiler||
*bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
![](tg://emoji?id=5368324170671202286)
`inline fixed-width code`
```
pre-formatted fixed-width code block
```
```python
pre-formatted fixed-width code block written in the Python programming language
```
>Block quotation started
>Block quotation continued
>Block quotation continued
>Block quotation continued
>The last line of the block quotation
**>The expandable block quotation started right after the previous block quotation
>It is separated from the previous block quotation by an empty bold entity
>Expandable block quotation continued
>Hidden by default part of the expandable block quotation started
>Expandable block quotation continued
>The last line of the expandable block quotation with the expandability mark||
```

Please note:

*   Any character with code between 1 and 126 inclusively can be escaped anywhere with a preceding '\' character, in which case it is treated as an ordinary character and not a part of the markup. This implies that '\' character usually must be escaped with a preceding '\' character.
*   Inside `pre` and `code` entities, all '`' and '\' characters must be escaped with a preceding '\' character.
*   Inside the `(...)` part of the inline link and custom emoji definition, all ')' and '\' must be escaped with a preceding '\' character.
*   In all other places characters '_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!' must be escaped with the preceding character '\'.
*   In case of ambiguity between `italic` and `underline` entities `__` is always greadily treated from left to right as beginning or end of an `underline` entity, so instead of `___italic underline___` use `___italic underline_**__`, adding an empty bold entity as a separator.
*   A valid emoji must be provided as an alternative value for the custom emoji. The emoji will be shown instead of the custom emoji in places where a custom emoji cannot be displayed (e.g., system notifications) or if the message is forwarded by a non-premium user. It is recommended to use the emoji from the **emoji** field of the custom emoji [sticker](https://core.telegram.org/bots/api#sticker).
*   Custom emoji entities can only be used by bots that purchased additional usernames on [Fragment](https://fragment.com/).

###### [](https://core.telegram.org/bots/api#html-style)HTML style

To use this mode, pass _HTML_ in the _parse\_mode_ field. The following tags are currently supported:

```
<b>bold</b>, <strong>bold</strong>
<i>italic</i>, <em>italic</em>
<u>underline</u>, <ins>underline</ins>
<s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
<span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler>
<b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>
<a href="http://www.example.com/">inline URL</a>
<a href="tg://user?id=123456789">inline mention of a user</a>
<tg-emoji emoji-id="5368324170671202286"></tg-emoji>
<code>inline fixed-width code</code>
<pre>pre-formatted fixed-width code block</pre>
<pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>
<blockquote>Block quotation started\nBlock quotation continued\nThe last line of the block quotation</blockquote>
<blockquote expandable>Expandable block quotation started\nExpandable block quotation continued\nExpandable block quotation continued\nHidden by default part of the block quotation started\nExpandable block quotation continued\nThe last line of the block quotation</blockquote>
```

Please note:

*   Only the tags mentioned above are currently supported.
*   All `<`, `>` and `&` symbols that are not a part of a tag or an HTML entity must be replaced with the corresponding HTML entities (`<` with `&lt;`, `>` with `&gt;` and `&` with `&amp;`).
*   All numerical HTML entities are supported.
*   The API currently supports only the following named HTML entities: `&lt;`, `&gt;`, `&amp;` and `&quot;`.
*   Use nested `pre` and `code` tags, to define programming language for `pre` entity.
*   Programming language can't be specified for standalone `code` tags.
*   A valid emoji must be used as the content of the `tg-emoji` tag. The emoji will be shown instead of the custom emoji in places where a custom emoji cannot be displayed (e.g., system notifications) or if the message is forwarded by a non-premium user. It is recommended to use the emoji from the **emoji** field of the custom emoji [sticker](https://core.telegram.org/bots/api#sticker).
*   Custom emoji entities can only be used by bots that purchased additional usernames on [Fragment](https://fragment.com/).

###### [](https://core.telegram.org/bots/api#markdown-style)Markdown style

This is a legacy mode, retained for backward compatibility. To use this mode, pass _Markdown_ in the _parse\_mode_ field. Use the following syntax in your message:

```
*bold text*
_italic text_
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
`inline fixed-width code`
```
pre-formatted fixed-width code block
```
```python
pre-formatted fixed-width code block written in the Python programming language
```
```

Please note:

*   Entities must not be nested, use parse mode [MarkdownV2](https://core.telegram.org/bots/api#markdownv2-style) instead.
*   There is no way to specify “underline”, “strikethrough”, “spoiler”, “blockquote”, “expandable_blockquote” and “custom_emoji” entities, use parse mode [MarkdownV2](https://core.telegram.org/bots/api#markdownv2-style) instead.
*   To escape characters '_', '*', '`', '[' outside of an entity, prepend the characters '\' before them.
*   Escaping inside entities is not allowed, so entity must be closed first and reopened again: use `_snake_\__case_` for italic `snake_case` and `*2*\**2=4*` for bold `2*2=4`.

#### [](https://core.telegram.org/bots/api#paid-broadcasts)Paid Broadcasts

By default, all bots are able to broadcast up to [30 messages](https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this) per second to their users. Developers can increase this limit by enabling _Paid Broadcasts_ in [@Botfather](https://t.me/botfather) - allowing their bot to broadcast **up to 1000 messages** per second.

Each message broadcasted over the free amount of 30 messages per second incurs a cost of 0.1 Stars per message, paid with Telegram Stars from the bot's balance. In order to use this feature, a bot must have at least _10,000 Stars_ on its balance.

> Bots with increased limits are only charged for messages that are broadcasted successfully.

#### [](https://core.telegram.org/bots/api#forwardmessage)forwardMessage

Use this method to forward messages of any kind. Service messages and messages with protected content can't be forwarded. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat |
| from_chat_id | Integer or String | Yes | Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`) |
| video_start_timestamp | Integer | Optional | New start timestamp for the forwarded video in the message |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the forwarded message from forwarding and saving |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only |
| message_id | Integer | Yes | Message identifier in the chat specified in _from\_chat\_id_ |

#### [](https://core.telegram.org/bots/api#forwardmessages)forwardMessages

Use this method to forward multiple messages of any kind. If some of the specified messages can't be found or forwarded, they are skipped. Service messages and messages with protected content can't be forwarded. Album grouping is kept for forwarded messages. On success, an array of [MessageId](https://core.telegram.org/bots/api#messageid) of the sent messages is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat |
| from_chat_id | Integer or String | Yes | Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`) |
| message_ids | Array of Integer | Yes | A JSON-serialized list of 1-100 identifiers of messages in the chat _from\_chat\_id_ to forward. The identifiers must be specified in a strictly increasing order. |
| disable_notification | Boolean | Optional | Sends the messages [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the forwarded messages from forwarding and saving |

#### [](https://core.telegram.org/bots/api#copymessage)copyMessage

Use this method to copy messages of any kind. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz [poll](https://core.telegram.org/bots/api#poll) can be copied only if the value of the field _correct\_option\_id_ is known to the bot. The method is analogous to the method [forwardMessage](https://core.telegram.org/bots/api#forwardmessage), but the copied message doesn't have a link to the original message. Returns the [MessageId](https://core.telegram.org/bots/api#messageid) of the sent message on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| from_chat_id | Integer or String | Yes | Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`) |
| message_id | Integer | Yes | Message identifier in the chat specified in _from\_chat\_id_ |
| video_start_timestamp | Integer | Optional | New start timestamp for the copied video in the message |
| caption | String | Optional | New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept |
| parse_mode | String | Optional | Mode for parsing entities in the new caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | Optional | Pass _True_, if the caption must be shown above the message media. Ignored if a new caption isn't specified. |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#copymessages)copyMessages

Use this method to copy messages of any kind. If some of the specified messages can't be found or copied, they are skipped. Service messages, paid media messages, giveaway messages, giveaway winners messages, and invoice messages can't be copied. A quiz [poll](https://core.telegram.org/bots/api#poll) can be copied only if the value of the field _correct\_option\_id_ is known to the bot. The method is analogous to the method [forwardMessages](https://core.telegram.org/bots/api#forwardmessages), but the copied messages don't have a link to the original message. Album grouping is kept for copied messages. On success, an array of [MessageId](https://core.telegram.org/bots/api#messageid) of the sent messages is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat |
| from_chat_id | Integer or String | Yes | Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`) |
| message_ids | Array of Integer | Yes | A JSON-serialized list of 1-100 identifiers of messages in the chat _from\_chat\_id_ to copy. The identifiers must be specified in a strictly increasing order. |
| disable_notification | Boolean | Optional | Sends the messages [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent messages from forwarding and saving |
| remove_caption | Boolean | Optional | Pass _True_ to copy the messages without their captions |

#### [](https://core.telegram.org/bots/api#sendphoto)sendPhoto

Use this method to send photos. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| photo | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Yes | Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| caption | String | Optional | Photo caption (may also be used when resending photos by _file\_id_), 0-1024 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | Optional | Pass _True_, if the caption must be shown above the message media |
| has_spoiler | Boolean | Optional | Pass _True_ if the photo needs to be covered with a spoiler animation |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendaudio)sendAudio

Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.

For sending voice messages, use the [sendVoice](https://core.telegram.org/bots/api#sendvoice) method instead.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| audio | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Yes | Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| caption | String | Optional | Audio caption, 0-1024 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the audio caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| duration | Integer | Optional | Duration of the audio in seconds |
| performer | String | Optional | Performer |
| title | String | Optional | Track name |
| thumbnail | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Optional | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#senddocument)sendDocument

Use this method to send general files. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| document | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Yes | File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| thumbnail | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Optional | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| caption | String | Optional | Document caption (may also be used when resending documents by _file\_id_), 0-1024 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| disable_content_type_detection | Boolean | Optional | Disables automatic server-side content type detection for files uploaded using multipart/form-data |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendvideo)sendVideo

Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as [Document](https://core.telegram.org/bots/api#document)). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| video | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Yes | Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| duration | Integer | Optional | Duration of sent video in seconds |
| width | Integer | Optional | Video width |
| height | Integer | Optional | Video height |
| thumbnail | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Optional | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| cover | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Optional | Cover for the video in the message. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new one using multipart/form-data under <file_attach_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| start_timestamp | Integer | Optional | Start timestamp for the video in the message |
| caption | String | Optional | Video caption (may also be used when resending videos by _file\_id_), 0-1024 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | Optional | Pass _True_, if the caption must be shown above the message media |
| has_spoiler | Boolean | Optional | Pass _True_ if the video needs to be covered with a spoiler animation |
| supports_streaming | Boolean | Optional | Pass _True_ if the uploaded video is suitable for streaming |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendanimation)sendAnimation

Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| animation | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Yes | Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| duration | Integer | Optional | Duration of sent animation in seconds |
| width | Integer | Optional | Animation width |
| height | Integer | Optional | Animation height |
| thumbnail | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Optional | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| caption | String | Optional | Animation caption (may also be used when resending animation by _file\_id_), 0-1024 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the animation caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | Optional | Pass _True_, if the caption must be shown above the message media |
| has_spoiler | Boolean | Optional | Pass _True_ if the animation needs to be covered with a spoiler animation |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendvoice)sendVoice

Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS, or in .MP3 format, or in .M4A format (other formats may be sent as [Audio](https://core.telegram.org/bots/api#audio) or [Document](https://core.telegram.org/bots/api#document)). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| voice | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Yes | Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| caption | String | Optional | Voice message caption, 0-1024 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the voice message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| duration | Integer | Optional | Duration of the voice message in seconds |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendvideonote)sendVideoNote

As of [v.4.0](https://telegram.org/blog/video-messages-and-telescope), Telegram clients support rounded square MPEG4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| video_note | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Yes | Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Sending video notes by a URL is currently unsupported |
| duration | Integer | Optional | Duration of sent video in seconds |
| length | Integer | Optional | Video width and height, i.e. diameter of the video message |
| thumbnail | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Optional | Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendpaidmedia)sendPaidMedia

Use this method to send paid media. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance. |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| star_count | Integer | Yes | The number of Telegram Stars that must be paid to buy access to the media; 1-10000 |
| media | Array of [InputPaidMedia](https://core.telegram.org/bots/api#inputpaidmedia) | Yes | A JSON-serialized array describing the media to be sent; up to 10 items |
| payload | String | Optional | Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes. |
| caption | String | Optional | Media caption, 0-1024 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the media caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | Optional | Pass _True_, if the caption must be shown above the message media |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendmediagroup)sendMediaGroup

Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of [Message](https://core.telegram.org/bots/api#message) objects that were sent is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat |
| media | Array of [InputMediaAudio](https://core.telegram.org/bots/api#inputmediaaudio), [InputMediaDocument](https://core.telegram.org/bots/api#inputmediadocument), [InputMediaPhoto](https://core.telegram.org/bots/api#inputmediaphoto) and [InputMediaVideo](https://core.telegram.org/bots/api#inputmediavideo) | Yes | A JSON-serialized array describing messages to be sent, must include 2-10 items |
| disable_notification | Boolean | Optional | Sends messages [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent messages from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |

#### [](https://core.telegram.org/bots/api#sendlocation)sendLocation

Use this method to send point on the map. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| latitude | Float | Yes | Latitude of the location |
| longitude | Float | Yes | Longitude of the location |
| horizontal_accuracy | Float | Optional | The radius of uncertainty for the location, measured in meters; 0-1500 |
| live_period | Integer | Optional | Period in seconds during which the location will be updated (see [Live Locations](https://telegram.org/blog/live-locations), should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. |
| heading | Integer | Optional | For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. |
| proximity_alert_radius | Integer | Optional | For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendvenue)sendVenue

Use this method to send information about a venue. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| latitude | Float | Yes | Latitude of the venue |
| longitude | Float | Yes | Longitude of the venue |
| title | String | Yes | Name of the venue |
| address | String | Yes | Address of the venue |
| foursquare_id | String | Optional | Foursquare identifier of the venue |
| foursquare_type | String | Optional | Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) |
| google_place_id | String | Optional | Google Places identifier of the venue |
| google_place_type | String | Optional | Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).) |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendcontact)sendContact

Use this method to send phone contacts. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| phone_number | String | Yes | Contact's phone number |
| first_name | String | Yes | Contact's first name |
| last_name | String | Optional | Contact's last name |
| vcard | String | Optional | Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard), 0-2048 bytes |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendpoll)sendPoll

Use this method to send a native poll. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Polls can't be sent to channel direct messages chats. |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| question | String | Yes | Poll question, 1-300 characters |
| question_parse_mode | String | Optional | Mode for parsing entities in the question. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Currently, only custom emoji entities are allowed |
| question_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the poll question. It can be specified instead of _question\_parse\_mode_ |
| options | Array of [InputPollOption](https://core.telegram.org/bots/api#inputpolloption) | Yes | A JSON-serialized list of 2-12 answer options |
| is_anonymous | Boolean | Optional | _True_, if the poll needs to be anonymous, defaults to _True_ |
| type | String | Optional | Poll type, “quiz” or “regular”, defaults to “regular” |
| allows_multiple_answers | Boolean | Optional | _True_, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to _False_ |
| correct_option_id | Integer | Optional | 0-based identifier of the correct answer option, required for polls in quiz mode |
| explanation | String | Optional | Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing |
| explanation_parse_mode | String | Optional | Mode for parsing entities in the explanation. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| explanation_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the poll explanation. It can be specified instead of _explanation\_parse\_mode_ |
| open_period | Integer | Optional | Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with _close\_date_. |
| close_date | Integer | Optional | Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with _open\_period_. |
| is_closed | Boolean | Optional | Pass _True_ if the poll needs to be immediately closed. This can be useful for poll preview. |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendchecklist)sendChecklist

Use this method to send a checklist on behalf of a connected business account. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer | Yes | Unique identifier for the target chat |
| checklist | [InputChecklist](https://core.telegram.org/bots/api#inputchecklist) | Yes | A JSON-serialized object for the checklist to send |
| disable_notification | Boolean | Optional | Sends the message silently. Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | A JSON-serialized object for description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for an inline keyboard |

#### [](https://core.telegram.org/bots/api#senddice)sendDice

Use this method to send an animated emoji that will display a random value. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| emoji | String | Optional | Emoji on which the dice throw animation is based. Currently, must be one of “”, “”, “”, “”, “”, or “”. Dice can have values 1-6 for “”, “” and “”, values 1-5 for “” and “”, and values 1-64 for “”. Defaults to “” |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#sendchataction)sendChatAction

Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns _True_ on success.

> Example: The [ImageBot](https://t.me/imagebot) needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use [sendChatAction](https://core.telegram.org/bots/api#sendchataction) with _action_ = _upload\_photo_. The user will see a “sending photo” status for the bot.

We only recommend using this method when a response from the bot will take a **noticeable** amount of time to arrive.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the action will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel chats and channel direct messages chats aren't supported. |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread; for supergroups only |
| action | String | Yes | Type of action to broadcast. Choose one, depending on what the user is about to receive: _typing_ for [text messages](https://core.telegram.org/bots/api#sendmessage), _upload\_photo_ for [photos](https://core.telegram.org/bots/api#sendphoto), _record\_video_ or _upload\_video_ for [videos](https://core.telegram.org/bots/api#sendvideo), _record\_voice_ or _upload\_voice_ for [voice notes](https://core.telegram.org/bots/api#sendvoice), _upload\_document_ for [general files](https://core.telegram.org/bots/api#senddocument), _choose\_sticker_ for [stickers](https://core.telegram.org/bots/api#sendsticker), _find\_location_ for [location data](https://core.telegram.org/bots/api#sendlocation), _record\_video\_note_ or _upload\_video\_note_ for [video notes](https://core.telegram.org/bots/api#sendvideonote). |

#### [](https://core.telegram.org/bots/api#setmessagereaction)setMessageReaction

Use this method to change the chosen reactions on a message. Service messages of some types can't be reacted to. Automatically forwarded messages from a channel to its discussion group have the same available reactions as messages in the channel. Bots can't use paid reactions. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Yes | Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead. |
| reaction | Array of [ReactionType](https://core.telegram.org/bots/api#reactiontype) | Optional | A JSON-serialized list of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots. |
| is_big | Boolean | Optional | Pass _True_ to set the reaction with a big animation |

#### [](https://core.telegram.org/bots/api#getuserprofilephotos)getUserProfilePhotos

Use this method to get a list of profile pictures for a user. Returns a [UserProfilePhotos](https://core.telegram.org/bots/api#userprofilephotos) object.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | Unique identifier of the target user |
| offset | Integer | Optional | Sequential number of the first photo to be returned. By default, all photos are returned. |
| limit | Integer | Optional | Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100. |

#### [](https://core.telegram.org/bots/api#setuseremojistatus)setUserEmojiStatus

Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App method [requestEmojiStatusAccess](https://core.telegram.org/bots/webapps#initializing-mini-apps). Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | Unique identifier of the target user |
| emoji_status_custom_emoji_id | String | Optional | Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status. |
| emoji_status_expiration_date | Integer | Optional | Expiration date of the emoji status, if any |

#### [](https://core.telegram.org/bots/api#getfile)getFile

Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a [File](https://core.telegram.org/bots/api#file) object is returned. The file can then be downloaded via the link `https://api.telegram.org/file/bot<token>/<file_path>`, where `<file_path>` is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling [getFile](https://core.telegram.org/bots/api#getfile) again.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| file_id | String | Yes | File identifier to get information about |

**Note:** This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.

#### [](https://core.telegram.org/bots/api#banchatmember)banChatMember

Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless [unbanned](https://core.telegram.org/bots/api#unbanchatmember) first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`) |
| user_id | Integer | Yes | Unique identifier of the target user |
| until_date | Integer | Optional | Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only. |
| revoke_messages | Boolean | Optional | Pass _True_ to delete all messages from the chat for the user that is being removed. If _False_, the user will be able to see messages in the group that were sent before the user was removed. Always _True_ for supergroups and channels. |

#### [](https://core.telegram.org/bots/api#unbanchatmember)unbanChatMember

Use this method to unban a previously banned user in a supergroup or channel. The user will **not** return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be **removed** from the chat. If you don't want this, use the parameter _only\_if\_banned_. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`) |
| user_id | Integer | Yes | Unique identifier of the target user |
| only_if_banned | Boolean | Optional | Do nothing if the user is not banned |

#### [](https://core.telegram.org/bots/api#restrictchatmember)restrictChatMember

Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass _True_ for all permissions to lift restrictions from a user. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| user_id | Integer | Yes | Unique identifier of the target user |
| permissions | [ChatPermissions](https://core.telegram.org/bots/api#chatpermissions) | Yes | A JSON-serialized object for new user permissions |
| use_independent_chat_permissions | Boolean | Optional | Pass _True_ if chat permissions are set independently. Otherwise, the _can\_send\_other\_messages_ and _can\_add\_web\_page\_previews_ permissions will imply the _can\_send\_messages_, _can\_send\_audios_, _can\_send\_documents_, _can\_send\_photos_, _can\_send\_videos_, _can\_send\_video\_notes_, and _can\_send\_voice\_notes_ permissions; the _can\_send\_polls_ permission will imply the _can\_send\_messages_ permission. |
| until_date | Integer | Optional | Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever |

#### [](https://core.telegram.org/bots/api#promotechatmember)promoteChatMember

Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass _False_ for all boolean parameters to demote a user. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| user_id | Integer | Yes | Unique identifier of the target user |
| is_anonymous | Boolean | Optional | Pass _True_ if the administrator's presence in the chat is hidden |
| can_manage_chat | Boolean | Optional | Pass _True_ if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege. |
| can_delete_messages | Boolean | Optional | Pass _True_ if the administrator can delete messages of other users |
| can_manage_video_chats | Boolean | Optional | Pass _True_ if the administrator can manage video chats |
| can_restrict_members | Boolean | Optional | Pass _True_ if the administrator can restrict, ban or unban chat members, or access supergroup statistics |
| can_promote_members | Boolean | Optional | Pass _True_ if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him) |
| can_change_info | Boolean | Optional | Pass _True_ if the administrator can change chat title, photo and other settings |
| can_invite_users | Boolean | Optional | Pass _True_ if the administrator can invite new users to the chat |
| can_post_stories | Boolean | Optional | Pass _True_ if the administrator can post stories to the chat |
| can_edit_stories | Boolean | Optional | Pass _True_ if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive |
| can_delete_stories | Boolean | Optional | Pass _True_ if the administrator can delete stories posted by other users |
| can_post_messages | Boolean | Optional | Pass _True_ if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only |
| can_edit_messages | Boolean | Optional | Pass _True_ if the administrator can edit messages of other users and can pin messages; for channels only |
| can_pin_messages | Boolean | Optional | Pass _True_ if the administrator can pin messages; for supergroups only |
| can_manage_topics | Boolean | Optional | Pass _True_ if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only |
| can_manage_direct_messages | Boolean | Optional | Pass _True_ if the administrator can manage direct messages within the channel and decline suggested posts; for channels only |

#### [](https://core.telegram.org/bots/api#setchatadministratorcustomtitle)setChatAdministratorCustomTitle

Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| user_id | Integer | Yes | Unique identifier of the target user |
| custom_title | String | Yes | New custom title for the administrator; 0-16 characters, emoji are not allowed |

#### [](https://core.telegram.org/bots/api#banchatsenderchat)banChatSenderChat

Use this method to ban a channel chat in a supergroup or a channel. Until the chat is [unbanned](https://core.telegram.org/bots/api#unbanchatsenderchat), the owner of the banned chat won't be able to send messages on behalf of **any of their channels**. The bot must be an administrator in the supergroup or channel for this to work and must have the appropriate administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| sender_chat_id | Integer | Yes | Unique identifier of the target sender chat |

#### [](https://core.telegram.org/bots/api#unbanchatsenderchat)unbanChatSenderChat

Use this method to unban a previously banned channel chat in a supergroup or channel. The bot must be an administrator for this to work and must have the appropriate administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| sender_chat_id | Integer | Yes | Unique identifier of the target sender chat |

#### [](https://core.telegram.org/bots/api#setchatpermissions)setChatPermissions

Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the _can\_restrict\_members_ administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| permissions | [ChatPermissions](https://core.telegram.org/bots/api#chatpermissions) | Yes | A JSON-serialized object for new default chat permissions |
| use_independent_chat_permissions | Boolean | Optional | Pass _True_ if chat permissions are set independently. Otherwise, the _can\_send\_other\_messages_ and _can\_add\_web\_page\_previews_ permissions will imply the _can\_send\_messages_, _can\_send\_audios_, _can\_send\_documents_, _can\_send\_photos_, _can\_send\_videos_, _can\_send\_video\_notes_, and _can\_send\_voice\_notes_ permissions; the _can\_send\_polls_ permission will imply the _can\_send\_messages_ permission. |

#### [](https://core.telegram.org/bots/api#exportchatinvitelink)exportChatInviteLink

Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as _String_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |

> Note: Each administrator in a chat generates their own invite links. Bots can't use invite links generated by other administrators. If you want your bot to work with invite links, it will need to generate its own link using [exportChatInviteLink](https://core.telegram.org/bots/api#exportchatinvitelink) or by calling the [getChat](https://core.telegram.org/bots/api#getchat) method. If your bot needs to generate a new primary invite link replacing its previous one, use [exportChatInviteLink](https://core.telegram.org/bots/api#exportchatinvitelink) again.

#### [](https://core.telegram.org/bots/api#createchatinvitelink)createChatInviteLink

Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink). Returns the new invite link as [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| name | String | Optional | Invite link name; 0-32 characters |
| expire_date | Integer | Optional | Point in time (Unix timestamp) when the link will expire |
| member_limit | Integer | Optional | The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 |
| creates_join_request | Boolean | Optional | _True_, if users joining the chat via the link need to be approved by chat administrators. If _True_, _member\_limit_ can't be specified |

#### [](https://core.telegram.org/bots/api#editchatinvitelink)editChatInviteLink

Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| invite_link | String | Yes | The invite link to edit |
| name | String | Optional | Invite link name; 0-32 characters |
| expire_date | Integer | Optional | Point in time (Unix timestamp) when the link will expire |
| member_limit | Integer | Optional | The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 |
| creates_join_request | Boolean | Optional | _True_, if users joining the chat via the link need to be approved by chat administrators. If _True_, _member\_limit_ can't be specified |

#### [](https://core.telegram.org/bots/api#createchatsubscriptioninvitelink)createChatSubscriptionInviteLink

Use this method to create a [subscription invite link](https://telegram.org/blog/superchannels-star-reactions-subscriptions#star-subscriptions) for a channel chat. The bot must have the _can\_invite\_users_ administrator rights. The link can be edited using the method [editChatSubscriptionInviteLink](https://core.telegram.org/bots/api#editchatsubscriptioninvitelink) or revoked using the method [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink). Returns the new invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target channel chat or username of the target channel (in the format `@channelusername`) |
| name | String | Optional | Invite link name; 0-32 characters |
| subscription_period | Integer | Yes | The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days). |
| subscription_price | Integer | Yes | The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000 |

#### [](https://core.telegram.org/bots/api#editchatsubscriptioninvitelink)editChatSubscriptionInviteLink

Use this method to edit a subscription invite link created by the bot. The bot must have the _can\_invite\_users_ administrator rights. Returns the edited invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| invite_link | String | Yes | The invite link to edit |
| name | String | Optional | Invite link name; 0-32 characters |

#### [](https://core.telegram.org/bots/api#revokechatinvitelink)revokeChatInviteLink

Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier of the target chat or username of the target channel (in the format `@channelusername`) |
| invite_link | String | Yes | The invite link to revoke |

#### [](https://core.telegram.org/bots/api#approvechatjoinrequest)approveChatJoinRequest

Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the _can\_invite\_users_ administrator right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| user_id | Integer | Yes | Unique identifier of the target user |

#### [](https://core.telegram.org/bots/api#declinechatjoinrequest)declineChatJoinRequest

Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the _can\_invite\_users_ administrator right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| user_id | Integer | Yes | Unique identifier of the target user |

#### [](https://core.telegram.org/bots/api#setchatphoto)setChatPhoto

Use this method to set a new profile photo for the chat. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| photo | [InputFile](https://core.telegram.org/bots/api#inputfile) | Yes | New chat photo, uploaded using multipart/form-data |

#### [](https://core.telegram.org/bots/api#deletechatphoto)deleteChatPhoto

Use this method to delete a chat photo. Photos can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |

#### [](https://core.telegram.org/bots/api#setchattitle)setChatTitle

Use this method to change the title of a chat. Titles can't be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| title | String | Yes | New chat title, 1-128 characters |

#### [](https://core.telegram.org/bots/api#setchatdescription)setChatDescription

Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| description | String | Optional | New chat description, 0-255 characters |

#### [](https://core.telegram.org/bots/api#pinchatmessage)pinChatMessage

Use this method to add a message to the list of pinned messages in a chat. In private chats and channel direct messages chats, all non-service messages can be pinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to pin messages in groups and channels respectively. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be pinned |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Yes | Identifier of a message to pin |
| disable_notification | Boolean | Optional | Pass _True_ if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats. |

#### [](https://core.telegram.org/bots/api#unpinchatmessage)unpinChatMessage

Use this method to remove a message from the list of pinned messages in a chat. In private chats and channel direct messages chats, all messages can be unpinned. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin messages in groups and channels respectively. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be unpinned |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Optional | Identifier of the message to unpin. Required if _business\_connection\_id_ is specified. If not specified, the most recent pinned message (by sending date) will be unpinned. |

#### [](https://core.telegram.org/bots/api#unpinallchatmessages)unpinAllChatMessages

Use this method to clear the list of pinned messages in a chat. In private chats and channel direct messages chats, no additional rights are required to unpin all pinned messages. Conversely, the bot must be an administrator with the 'can_pin_messages' right or the 'can_edit_messages' right to unpin all pinned messages in groups and channels respectively. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |

#### [](https://core.telegram.org/bots/api#leavechat)leaveChat

Use this method for your bot to leave a group, supergroup or channel. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`). Channel direct messages chats aren't supported; leave the corresponding channel instead. |

#### [](https://core.telegram.org/bots/api#getchat)getChat

Use this method to get up-to-date information about the chat. Returns a [ChatFullInfo](https://core.telegram.org/bots/api#chatfullinfo) object on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`) |

#### [](https://core.telegram.org/bots/api#getchatadministrators)getChatAdministrators

Use this method to get a list of administrators in a chat, which aren't bots. Returns an Array of [ChatMember](https://core.telegram.org/bots/api#chatmember) objects.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`) |

#### [](https://core.telegram.org/bots/api#getchatmembercount)getChatMemberCount

Use this method to get the number of members in a chat. Returns _Int_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`) |

#### [](https://core.telegram.org/bots/api#getchatmember)getChatMember

Use this method to get information about a member of a chat. The method is only guaranteed to work for other users if the bot is an administrator in the chat. Returns a [ChatMember](https://core.telegram.org/bots/api#chatmember) object on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`) |
| user_id | Integer | Yes | Unique identifier of the target user |

#### [](https://core.telegram.org/bots/api#setchatstickerset)setChatStickerSet

Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can\_set\_sticker\_set_ optionally returned in [getChat](https://core.telegram.org/bots/api#getchat) requests to check if the bot can use this method. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| sticker_set_name | String | Yes | Name of the sticker set to be set as the group sticker set |

#### [](https://core.telegram.org/bots/api#deletechatstickerset)deleteChatStickerSet

Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field _can\_set\_sticker\_set_ optionally returned in [getChat](https://core.telegram.org/bots/api#getchat) requests to check if the bot can use this method. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |

#### [](https://core.telegram.org/bots/api#getforumtopiciconstickers)getForumTopicIconStickers

Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. Requires no parameters. Returns an Array of [Sticker](https://core.telegram.org/bots/api#sticker) objects.

#### [](https://core.telegram.org/bots/api#createforumtopic)createForumTopic

Use this method to create a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights. Returns information about the created topic as a [ForumTopic](https://core.telegram.org/bots/api#forumtopic) object.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| name | String | Yes | Topic name, 1-128 characters |
| icon_color | Integer | Optional | Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F) |
| icon_custom_emoji_id | String | Optional | Unique identifier of the custom emoji shown as the topic icon. Use [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers) to get all allowed custom emoji identifiers. |

#### [](https://core.telegram.org/bots/api#editforumtopic)editForumTopic

Use this method to edit name and icon of a topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| message_thread_id | Integer | Yes | Unique identifier for the target message thread of the forum topic |
| name | String | Optional | New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept |
| icon_custom_emoji_id | String | Optional | New unique identifier of the custom emoji shown as the topic icon. Use [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers) to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept |

#### [](https://core.telegram.org/bots/api#closeforumtopic)closeForumTopic

Use this method to close an open topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| message_thread_id | Integer | Yes | Unique identifier for the target message thread of the forum topic |

#### [](https://core.telegram.org/bots/api#reopenforumtopic)reopenForumTopic

Use this method to reopen a closed topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights, unless it is the creator of the topic. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| message_thread_id | Integer | Yes | Unique identifier for the target message thread of the forum topic |

#### [](https://core.telegram.org/bots/api#deleteforumtopic)deleteForumTopic

Use this method to delete a forum topic along with all its messages in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_delete\_messages_ administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| message_thread_id | Integer | Yes | Unique identifier for the target message thread of the forum topic |

#### [](https://core.telegram.org/bots/api#unpinallforumtopicmessages)unpinAllForumTopicMessages

Use this method to clear the list of pinned messages in a forum topic. The bot must be an administrator in the chat for this to work and must have the _can\_pin\_messages_ administrator right in the supergroup. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| message_thread_id | Integer | Yes | Unique identifier for the target message thread of the forum topic |

#### [](https://core.telegram.org/bots/api#editgeneralforumtopic)editGeneralForumTopic

Use this method to edit the name of the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |
| name | String | Yes | New topic name, 1-128 characters |

#### [](https://core.telegram.org/bots/api#closegeneralforumtopic)closeGeneralForumTopic

Use this method to close an open 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |

#### [](https://core.telegram.org/bots/api#reopengeneralforumtopic)reopenGeneralForumTopic

Use this method to reopen a closed 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights. The topic will be automatically unhidden if it was hidden. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |

#### [](https://core.telegram.org/bots/api#hidegeneralforumtopic)hideGeneralForumTopic

Use this method to hide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights. The topic will be automatically closed if it was open. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |

#### [](https://core.telegram.org/bots/api#unhidegeneralforumtopic)unhideGeneralForumTopic

Use this method to unhide the 'General' topic in a forum supergroup chat. The bot must be an administrator in the chat for this to work and must have the _can\_manage\_topics_ administrator rights. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |

#### [](https://core.telegram.org/bots/api#unpinallgeneralforumtopicmessages)unpinAllGeneralForumTopicMessages

Use this method to clear the list of pinned messages in a General forum topic. The bot must be an administrator in the chat for this to work and must have the _can\_pin\_messages_ administrator right in the supergroup. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) |

#### [](https://core.telegram.org/bots/api#answercallbackquery)answerCallbackQuery

Use this method to send answers to callback queries sent from [inline keyboards](https://core.telegram.org/bots/features#inline-keyboards). The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, _True_ is returned.

> Alternatively, the user can be redirected to the specified Game URL. For this option to work, you must first create a game for your bot via [@BotFather](https://t.me/botfather) and accept the terms. Otherwise, you may use links like `t.me/your_bot?start=XXXX` that open your bot with a parameter.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| callback_query_id | String | Yes | Unique identifier for the query to be answered |
| text | String | Optional | Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters |
| show_alert | Boolean | Optional | If _True_, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to _false_. |
| url | String | Optional | URL that will be opened by the user's client. If you have created a [Game](https://core.telegram.org/bots/api#game) and accepted the conditions via [@BotFather](https://t.me/botfather), specify the URL that opens your game - note that this will only work if the query comes from a [_callback\_game_](https://core.telegram.org/bots/api#inlinekeyboardbutton) button. Otherwise, you may use links like `t.me/your_bot?start=XXXX` that open your bot with a parameter. |
| cache_time | Integer | Optional | The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0. |

#### [](https://core.telegram.org/bots/api#getuserchatboosts)getUserChatBoosts

Use this method to get the list of boosts added to a chat by a user. Requires administrator rights in the chat. Returns a [UserChatBoosts](https://core.telegram.org/bots/api#userchatboosts) object.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the chat or username of the channel (in the format `@channelusername`) |
| user_id | Integer | Yes | Unique identifier of the target user |

#### [](https://core.telegram.org/bots/api#getbusinessconnection)getBusinessConnection

Use this method to get information about the connection of the bot with a business account. Returns a [BusinessConnection](https://core.telegram.org/bots/api#businessconnection) object on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |

#### [](https://core.telegram.org/bots/api#setmycommands)setMyCommands

Use this method to change the list of the bot's commands. See [this manual](https://core.telegram.org/bots/features#commands) for more details about bot commands. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| commands | Array of [BotCommand](https://core.telegram.org/bots/api#botcommand) | Yes | A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified. |
| scope | [BotCommandScope](https://core.telegram.org/bots/api#botcommandscope) | Optional | A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to [BotCommandScopeDefault](https://core.telegram.org/bots/api#botcommandscopedefault). |
| language_code | String | Optional | A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands |

#### [](https://core.telegram.org/bots/api#deletemycommands)deleteMyCommands

Use this method to delete the list of the bot's commands for the given scope and user language. After deletion, [higher level commands](https://core.telegram.org/bots/api#determining-list-of-commands) will be shown to affected users. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| scope | [BotCommandScope](https://core.telegram.org/bots/api#botcommandscope) | Optional | A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to [BotCommandScopeDefault](https://core.telegram.org/bots/api#botcommandscopedefault). |
| language_code | String | Optional | A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands |

#### [](https://core.telegram.org/bots/api#getmycommands)getMyCommands

Use this method to get the current list of the bot's commands for the given scope and user language. Returns an Array of [BotCommand](https://core.telegram.org/bots/api#botcommand) objects. If commands aren't set, an empty list is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| scope | [BotCommandScope](https://core.telegram.org/bots/api#botcommandscope) | Optional | A JSON-serialized object, describing scope of users. Defaults to [BotCommandScopeDefault](https://core.telegram.org/bots/api#botcommandscopedefault). |
| language_code | String | Optional | A two-letter ISO 639-1 language code or an empty string |

#### [](https://core.telegram.org/bots/api#setmyname)setMyName

Use this method to change the bot's name. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| name | String | Optional | New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language. |
| language_code | String | Optional | A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name. |

#### [](https://core.telegram.org/bots/api#getmyname)getMyName

Use this method to get the current bot name for the given user language. Returns [BotName](https://core.telegram.org/bots/api#botname) on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| language_code | String | Optional | A two-letter ISO 639-1 language code or an empty string |

#### [](https://core.telegram.org/bots/api#setmydescription)setMyDescription

Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| description | String | Optional | New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language. |
| language_code | String | Optional | A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description. |

#### [](https://core.telegram.org/bots/api#getmydescription)getMyDescription

Use this method to get the current bot description for the given user language. Returns [BotDescription](https://core.telegram.org/bots/api#botdescription) on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| language_code | String | Optional | A two-letter ISO 639-1 language code or an empty string |

#### [](https://core.telegram.org/bots/api#setmyshortdescription)setMyShortDescription

Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together with the link when users share the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| short_description | String | Optional | New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language. |
| language_code | String | Optional | A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description. |

#### [](https://core.telegram.org/bots/api#getmyshortdescription)getMyShortDescription

Use this method to get the current bot short description for the given user language. Returns [BotShortDescription](https://core.telegram.org/bots/api#botshortdescription) on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| language_code | String | Optional | A two-letter ISO 639-1 language code or an empty string |

#### [](https://core.telegram.org/bots/api#setchatmenubutton)setChatMenuButton

Use this method to change the bot's menu button in a private chat, or the default menu button. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer | Optional | Unique identifier for the target private chat. If not specified, default bot's menu button will be changed |
| menu_button | [MenuButton](https://core.telegram.org/bots/api#menubutton) | Optional | A JSON-serialized object for the bot's new menu button. Defaults to [MenuButtonDefault](https://core.telegram.org/bots/api#menubuttondefault) |

#### [](https://core.telegram.org/bots/api#getchatmenubutton)getChatMenuButton

Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. Returns [MenuButton](https://core.telegram.org/bots/api#menubutton) on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer | Optional | Unique identifier for the target private chat. If not specified, default bot's menu button will be returned |

#### [](https://core.telegram.org/bots/api#setmydefaultadministratorrights)setMyDefaultAdministratorRights

Use this method to change the default administrator rights requested by the bot when it's added as an administrator to groups or channels. These rights will be suggested to users, but they are free to modify the list before adding the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| rights | [ChatAdministratorRights](https://core.telegram.org/bots/api#chatadministratorrights) | Optional | A JSON-serialized object describing new default administrator rights. If not specified, the default administrator rights will be cleared. |
| for_channels | Boolean | Optional | Pass _True_ to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed. |

#### [](https://core.telegram.org/bots/api#getmydefaultadministratorrights)getMyDefaultAdministratorRights

Use this method to get the current default administrator rights of the bot. Returns [ChatAdministratorRights](https://core.telegram.org/bots/api#chatadministratorrights) on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| for_channels | Boolean | Optional | Pass _True_ to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned. |

#### [](https://core.telegram.org/bots/api#getavailablegifts)getAvailableGifts

Returns the list of gifts that can be sent by the bot to users and channel chats. Requires no parameters. Returns a [Gifts](https://core.telegram.org/bots/api#gifts) object.

#### [](https://core.telegram.org/bots/api#sendgift)sendGift

Sends a gift to the given user or channel chat. The gift can't be converted to Telegram Stars by the receiver. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Optional | Required if _chat\_id_ is not specified. Unique identifier of the target user who will receive the gift. |
| chat_id | Integer or String | Optional | Required if _user\_id_ is not specified. Unique identifier for the chat or username of the channel (in the format `@channelusername`) that will receive the gift. |
| gift_id | String | Yes | Identifier of the gift |
| pay_for_upgrade | Boolean | Optional | Pass _True_ to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver |
| text | String | Optional | Text that will be shown along with the gift; 0-128 characters |
| text_parse_mode | String | Optional | Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom_emoji” are ignored. |
| text_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of _text\_parse\_mode_. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom_emoji” are ignored. |

#### [](https://core.telegram.org/bots/api#giftpremiumsubscription)giftPremiumSubscription

Gifts a Telegram Premium subscription to the given user. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | Unique identifier of the target user who will receive a Telegram Premium subscription |
| month_count | Integer | Yes | Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12 |
| star_count | Integer | Yes | Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months |
| text | String | Optional | Text that will be shown along with the service message about the subscription; 0-128 characters |
| text_parse_mode | String | Optional | Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom_emoji” are ignored. |
| text_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the gift text. It can be specified instead of _text\_parse\_mode_. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom_emoji” are ignored. |

#### [](https://core.telegram.org/bots/api#verifyuser)verifyUser

Verifies a user [on behalf of the organization](https://telegram.org/verify#third-party-verification) which is represented by the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | Unique identifier of the target user |
| custom_description | String | Optional | Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description. |

#### [](https://core.telegram.org/bots/api#verifychat)verifyChat

Verifies a chat [on behalf of the organization](https://telegram.org/verify#third-party-verification) which is represented by the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Channel direct messages chats can't be verified. |
| custom_description | String | Optional | Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description. |

#### [](https://core.telegram.org/bots/api#removeuserverification)removeUserVerification

Removes verification from a user who is currently verified [on behalf of the organization](https://telegram.org/verify#third-party-verification) represented by the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | Unique identifier of the target user |

#### [](https://core.telegram.org/bots/api#removechatverification)removeChatVerification

Removes verification from a chat that is currently verified [on behalf of the organization](https://telegram.org/verify#third-party-verification) represented by the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |

#### [](https://core.telegram.org/bots/api#readbusinessmessage)readBusinessMessage

Marks incoming message as read on behalf of a business account. Requires the _can\_read\_messages_ business bot right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection on behalf of which to read the message |
| chat_id | Integer | Yes | Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours. |
| message_id | Integer | Yes | Unique identifier of the message to mark as read |

#### [](https://core.telegram.org/bots/api#deletebusinessmessages)deleteBusinessMessages

Delete messages on behalf of a business account. Requires the _can\_delete\_sent\_messages_ business bot right to delete messages sent by the bot itself, or the _can\_delete\_all\_messages_ business bot right to delete any message. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection on behalf of which to delete the messages |
| message_ids | Array of Integer | Yes | A JSON-serialized list of 1-100 identifiers of messages to delete. All messages must be from the same chat. See [deleteMessage](https://core.telegram.org/bots/api#deletemessage) for limitations on which messages can be deleted |

#### [](https://core.telegram.org/bots/api#setbusinessaccountname)setBusinessAccountName

Changes the first and last name of a managed business account. Requires the _can\_change\_name_ business bot right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| first_name | String | Yes | The new value of the first name for the business account; 1-64 characters |
| last_name | String | Optional | The new value of the last name for the business account; 0-64 characters |

#### [](https://core.telegram.org/bots/api#setbusinessaccountusername)setBusinessAccountUsername

Changes the username of a managed business account. Requires the _can\_change\_username_ business bot right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| username | String | Optional | The new value of the username for the business account; 0-32 characters |

#### [](https://core.telegram.org/bots/api#setbusinessaccountbio)setBusinessAccountBio

Changes the bio of a managed business account. Requires the _can\_change\_bio_ business bot right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| bio | String | Optional | The new value of the bio for the business account; 0-140 characters |

#### [](https://core.telegram.org/bots/api#setbusinessaccountprofilephoto)setBusinessAccountProfilePhoto

Changes the profile photo of a managed business account. Requires the _can\_edit\_profile\_photo_ business bot right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| photo | [InputProfilePhoto](https://core.telegram.org/bots/api#inputprofilephoto) | Yes | The new profile photo to set |
| is_public | Boolean | Optional | Pass _True_ to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo. |

#### [](https://core.telegram.org/bots/api#removebusinessaccountprofilephoto)removeBusinessAccountProfilePhoto

Removes the current profile photo of a managed business account. Requires the _can\_edit\_profile\_photo_ business bot right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| is_public | Boolean | Optional | Pass _True_ to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo. |

#### [](https://core.telegram.org/bots/api#setbusinessaccountgiftsettings)setBusinessAccountGiftSettings

Changes the privacy settings pertaining to incoming gifts in a managed business account. Requires the _can\_change\_gift\_settings_ business bot right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| show_gift_button | Boolean | Yes | Pass _True_, if a button for sending a gift to the user or by the business account must always be shown in the input field |
| accepted_gift_types | [AcceptedGiftTypes](https://core.telegram.org/bots/api#acceptedgifttypes) | Yes | Types of gifts accepted by the business account |

#### [](https://core.telegram.org/bots/api#getbusinessaccountstarbalance)getBusinessAccountStarBalance

Returns the amount of Telegram Stars owned by a managed business account. Requires the _can\_view\_gifts\_and\_stars_ business bot right. Returns [StarAmount](https://core.telegram.org/bots/api#staramount) on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |

#### [](https://core.telegram.org/bots/api#transferbusinessaccountstars)transferBusinessAccountStars

Transfers Telegram Stars from the business account balance to the bot's balance. Requires the _can\_transfer\_stars_ business bot right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| star_count | Integer | Yes | Number of Telegram Stars to transfer; 1-10000 |

#### [](https://core.telegram.org/bots/api#getbusinessaccountgifts)getBusinessAccountGifts

Returns the gifts received and owned by a managed business account. Requires the _can\_view\_gifts\_and\_stars_ business bot right. Returns [OwnedGifts](https://core.telegram.org/bots/api#ownedgifts) on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| exclude_unsaved | Boolean | Optional | Pass _True_ to exclude gifts that aren't saved to the account's profile page |
| exclude_saved | Boolean | Optional | Pass _True_ to exclude gifts that are saved to the account's profile page |
| exclude_unlimited | Boolean | Optional | Pass _True_ to exclude gifts that can be purchased an unlimited number of times |
| exclude_limited | Boolean | Optional | Pass _True_ to exclude gifts that can be purchased a limited number of times |
| exclude_unique | Boolean | Optional | Pass _True_ to exclude unique gifts |
| sort_by_price | Boolean | Optional | Pass _True_ to sort results by gift price instead of send date. Sorting is applied before pagination. |
| offset | String | Optional | Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results |
| limit | Integer | Optional | The maximum number of gifts to be returned; 1-100. Defaults to 100 |

#### [](https://core.telegram.org/bots/api#convertgifttostars)convertGiftToStars

Converts a given regular gift to Telegram Stars. Requires the _can\_convert\_gifts\_to\_stars_ business bot right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| owned_gift_id | String | Yes | Unique identifier of the regular gift that should be converted to Telegram Stars |

#### [](https://core.telegram.org/bots/api#upgradegift)upgradeGift

Upgrades a given regular gift to a unique gift. Requires the _can\_transfer\_and\_upgrade\_gifts_ business bot right. Additionally requires the _can\_transfer\_stars_ business bot right if the upgrade is paid. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| owned_gift_id | String | Yes | Unique identifier of the regular gift that should be upgraded to a unique one |
| keep_original_details | Boolean | Optional | Pass _True_ to keep the original gift text, sender and receiver in the upgraded gift |
| star_count | Integer | Optional | The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If `gift.prepaid_upgrade_star_count > 0`, then pass 0, otherwise, the _can\_transfer\_stars_ business bot right is required and `gift.upgrade_star_count` must be passed. |

#### [](https://core.telegram.org/bots/api#transfergift)transferGift

Transfers an owned unique gift to another user. Requires the _can\_transfer\_and\_upgrade\_gifts_ business bot right. Requires _can\_transfer\_stars_ business bot right if the transfer is paid. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| owned_gift_id | String | Yes | Unique identifier of the regular gift that should be transferred |
| new_owner_chat_id | Integer | Yes | Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours. |
| star_count | Integer | Optional | The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the _can\_transfer\_stars_ business bot right is required. |

#### [](https://core.telegram.org/bots/api#poststory)postStory

Posts a story on behalf of a managed business account. Requires the _can\_manage\_stories_ business bot right. Returns [Story](https://core.telegram.org/bots/api#story) on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| content | [InputStoryContent](https://core.telegram.org/bots/api#inputstorycontent) | Yes | Content of the story |
| active_period | Integer | Yes | Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400` |
| caption | String | Optional | Caption of the story, 0-2048 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the story caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| areas | Array of [StoryArea](https://core.telegram.org/bots/api#storyarea) | Optional | A JSON-serialized list of clickable areas to be shown on the story |
| post_to_chat_page | Boolean | Optional | Pass _True_ to keep the story accessible after it expires |
| protect_content | Boolean | Optional | Pass _True_ if the content of the story must be protected from forwarding and screenshotting |

#### [](https://core.telegram.org/bots/api#editstory)editStory

Edits a story previously posted by the bot on behalf of a managed business account. Requires the _can\_manage\_stories_ business bot right. Returns [Story](https://core.telegram.org/bots/api#story) on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| story_id | Integer | Yes | Unique identifier of the story to edit |
| content | [InputStoryContent](https://core.telegram.org/bots/api#inputstorycontent) | Yes | Content of the story |
| caption | String | Optional | Caption of the story, 0-2048 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the story caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| areas | Array of [StoryArea](https://core.telegram.org/bots/api#storyarea) | Optional | A JSON-serialized list of clickable areas to be shown on the story |

#### [](https://core.telegram.org/bots/api#deletestory)deleteStory

Deletes a story previously posted by the bot on behalf of a managed business account. Requires the _can\_manage\_stories_ business bot right. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection |
| story_id | Integer | Yes | Unique identifier of the story to delete |

#### [](https://core.telegram.org/bots/api#inline-mode-methods)Inline mode methods

Methods and objects used in the inline mode are described in the [Inline mode section](https://core.telegram.org/bots/api#inline-mode).

### [](https://core.telegram.org/bots/api#updating-messages)Updating messages

The following methods allow you to change an existing message in the message history instead of sending a new one with a result of an action. This is most useful for messages with [inline keyboards](https://core.telegram.org/bots/features#inline-keyboards) using callback queries, but can also help reduce clutter in conversations with regular chat bots.

Please note, that it is currently only possible to edit messages without _reply\_markup_ or with [inline keyboards](https://core.telegram.org/bots/features#inline-keyboards).

#### [](https://core.telegram.org/bots/api#editmessagetext)editMessageText

Use this method to edit text and [game](https://core.telegram.org/bots/api#games) messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| chat_id | Integer or String | Optional | Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Optional | Required if _inline\_message\_id_ is not specified. Identifier of the message to edit |
| inline_message_id | String | Optional | Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message |
| text | String | Yes | New text of the message, 1-4096 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in message text, which can be specified instead of _parse\_mode_ |
| link_preview_options | [LinkPreviewOptions](https://core.telegram.org/bots/api#linkpreviewoptions) | Optional | Link preview generation options for the message |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). |

#### [](https://core.telegram.org/bots/api#editmessagecaption)editMessageCaption

Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| chat_id | Integer or String | Optional | Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Optional | Required if _inline\_message\_id_ is not specified. Identifier of the message to edit |
| inline_message_id | String | Optional | Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message |
| caption | String | Optional | New caption of the message, 0-1024 characters after entities parsing |
| parse_mode | String | Optional | Mode for parsing entities in the message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | Optional | A JSON-serialized list of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | Optional | Pass _True_, if the caption must be shown above the message media. Supported only for animation, photo and video messages. |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). |

#### [](https://core.telegram.org/bots/api#editmessagemedia)editMessageMedia

Use this method to edit animation, audio, document, photo, or video messages, or to add media to text messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can't be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| chat_id | Integer or String | Optional | Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Optional | Required if _inline\_message\_id_ is not specified. Identifier of the message to edit |
| inline_message_id | String | Optional | Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message |
| media | [InputMedia](https://core.telegram.org/bots/api#inputmedia) | Yes | A JSON-serialized object for a new media content of the message |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). |

#### [](https://core.telegram.org/bots/api#editmessagelivelocation)editMessageLiveLocation

Use this method to edit live location messages. A location can be edited until its _live\_period_ expires or editing is explicitly disabled by a call to [stopMessageLiveLocation](https://core.telegram.org/bots/api#stopmessagelivelocation). On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise _True_ is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| chat_id | Integer or String | Optional | Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Optional | Required if _inline\_message\_id_ is not specified. Identifier of the message to edit |
| inline_message_id | String | Optional | Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message |
| latitude | Float | Yes | Latitude of new location |
| longitude | Float | Yes | Longitude of new location |
| live_period | Integer | Optional | New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current _live\_period_ by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then _live\_period_ remains unchanged |
| horizontal_accuracy | Float | Optional | The radius of uncertainty for the location, measured in meters; 0-1500 |
| heading | Integer | Optional | Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. |
| proximity_alert_radius | Integer | Optional | The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). |

#### [](https://core.telegram.org/bots/api#stopmessagelivelocation)stopMessageLiveLocation

Use this method to stop updating a live location message before _live\_period_ expires. On success, if the message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise _True_ is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| chat_id | Integer or String | Optional | Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Optional | Required if _inline\_message\_id_ is not specified. Identifier of the message with live location to stop |
| inline_message_id | String | Optional | Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). |

#### [](https://core.telegram.org/bots/api#editmessagechecklist)editMessageChecklist

Use this method to edit a checklist on behalf of a connected business account. On success, the edited [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Yes | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer | Yes | Unique identifier for the target chat |
| message_id | Integer | Yes | Unique identifier for the target message |
| checklist | [InputChecklist](https://core.telegram.org/bots/api#inputchecklist) | Yes | A JSON-serialized object for the new checklist |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for the new inline keyboard for the message |

#### [](https://core.telegram.org/bots/api#editmessagereplymarkup)editMessageReplyMarkup

Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise _True_ is returned. Note that business messages that were not sent by the bot and do not contain an inline keyboard can only be edited within **48 hours** from the time they were sent.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| chat_id | Integer or String | Optional | Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Optional | Required if _inline\_message\_id_ is not specified. Identifier of the message to edit |
| inline_message_id | String | Optional | Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). |

#### [](https://core.telegram.org/bots/api#stoppoll)stopPoll

Use this method to stop a poll which was sent by the bot. On success, the stopped [Poll](https://core.telegram.org/bots/api#poll) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message to be edited was sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Yes | Identifier of the original message with the poll |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for a new message [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). |

#### [](https://core.telegram.org/bots/api#approvesuggestedpost)approveSuggestedPost

Use this method to approve a suggested post in a direct messages chat. The bot must have the 'can_post_messages' administrator right in the corresponding channel chat. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer | Yes | Unique identifier for the target direct messages chat |
| message_id | Integer | Yes | Identifier of a suggested post message to approve |
| send_date | Integer | Optional | Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future |

#### [](https://core.telegram.org/bots/api#declinesuggestedpost)declineSuggestedPost

Use this method to decline a suggested post in a direct messages chat. The bot must have the 'can_manage_direct_messages' administrator right in the corresponding channel chat. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer | Yes | Unique identifier for the target direct messages chat |
| message_id | Integer | Yes | Identifier of a suggested post message to decline |
| comment | String | Optional | Comment for the creator of the suggested post; 0-128 characters |

#### [](https://core.telegram.org/bots/api#deletemessage)deleteMessage

Use this method to delete a message, including service messages, with the following limitations:

- A message can only be deleted if it was sent less than 48 hours ago.

- Service messages about a supergroup, channel, or forum topic creation can't be deleted.

- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.

- Bots can delete outgoing messages in private chats, groups, and supergroups.

- Bots can delete incoming messages in private chats.

- Bots granted _can\_post\_messages_ permissions can delete outgoing messages in channels.

- If the bot is an administrator of a group, it can delete any message there.

- If the bot has _can\_delete\_messages_ administrator right in a supergroup or a channel, it can delete any message there.

- If the bot has _can\_manage\_direct\_messages_ administrator right in a channel, it can delete any message in the corresponding direct messages chat.

Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_id | Integer | Yes | Identifier of the message to delete |

#### [](https://core.telegram.org/bots/api#deletemessages)deleteMessages

Use this method to delete multiple messages simultaneously. If some of the specified messages can't be found, they are skipped. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_ids | Array of Integer | Yes | A JSON-serialized list of 1-100 identifiers of messages to delete. See [deleteMessage](https://core.telegram.org/bots/api#deletemessage) for limitations on which messages can be deleted |

### [](https://core.telegram.org/bots/api#stickers)Stickers

The following methods and objects allow your bot to handle stickers and sticker sets.

#### [](https://core.telegram.org/bots/api#sticker)Sticker

This object represents a sticker.

| Field | Type | Description |
| --- | --- | --- |
| file_id | String | Identifier for this file, which can be used to download or reuse the file |
| file_unique_id | String | Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| type | String | Type of the sticker, currently one of “regular”, “mask”, “custom_emoji”. The type of the sticker is independent from its format, which is determined by the fields _is\_animated_ and _is\_video_. |
| width | Integer | Sticker width |
| height | Integer | Sticker height |
| is_animated | Boolean | _True_, if the sticker is [animated](https://telegram.org/blog/animated-stickers) |
| is_video | Boolean | _True_, if the sticker is a [video sticker](https://telegram.org/blog/video-stickers-better-reactions) |
| thumbnail | [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Sticker thumbnail in the .WEBP or .JPG format |
| emoji | String | _Optional_. Emoji associated with the sticker |
| set_name | String | _Optional_. Name of the sticker set to which the sticker belongs |
| premium_animation | [File](https://core.telegram.org/bots/api#file) | _Optional_. For premium regular stickers, premium animation for the sticker |
| mask_position | [MaskPosition](https://core.telegram.org/bots/api#maskposition) | _Optional_. For mask stickers, the position where the mask should be placed |
| custom_emoji_id | String | _Optional_. For custom emoji stickers, unique identifier of the custom emoji |
| needs_repainting | True | _Optional_. _True_, if the sticker must be repainted to a text color in messages, the color of the Telegram Premium badge in emoji status, white color on chat photos, or another appropriate color in other places |
| file_size | Integer | _Optional_. File size in bytes |

#### [](https://core.telegram.org/bots/api#stickerset)StickerSet

This object represents a sticker set.

| Field | Type | Description |
| --- | --- | --- |
| name | String | Sticker set name |
| title | String | Sticker set title |
| sticker_type | String | Type of stickers in the set, currently one of “regular”, “mask”, “custom_emoji” |
| stickers | Array of [Sticker](https://core.telegram.org/bots/api#sticker) | List of all set stickers |
| thumbnail | [PhotoSize](https://core.telegram.org/bots/api#photosize) | _Optional_. Sticker set thumbnail in the .WEBP, .TGS, or .WEBM format |

#### [](https://core.telegram.org/bots/api#maskposition)MaskPosition

This object describes the position on faces where a mask should be placed by default.

| Field | Type | Description |
| --- | --- | --- |
| point | String | The part of the face relative to which the mask should be placed. One of “forehead”, “eyes”, “mouth”, or “chin”. |
| x_shift | Float | Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position. |
| y_shift | Float | Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position. |
| scale | Float | Mask scaling coefficient. For example, 2.0 means double size. |

#### [](https://core.telegram.org/bots/api#inputsticker)InputSticker

This object describes a sticker to be added to a sticker set.

| Field | Type | Description |
| --- | --- | --- |
| sticker | String | The added sticker. Pass a _file\_id_ as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or pass “attach://<file_attach_name>” to upload a new file using multipart/form-data under <file_attach_name> name. Animated and video stickers can't be uploaded via HTTP URL. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| format | String | Format of the added sticker, must be one of “static” for a **.WEBP** or **.PNG** image, “animated” for a **.TGS** animation, “video” for a **.WEBM** video |
| emoji_list | Array of String | List of 1-20 emoji associated with the sticker |
| mask_position | [MaskPosition](https://core.telegram.org/bots/api#maskposition) | _Optional_. Position where the mask should be placed on faces. For “mask” stickers only. |
| keywords | Array of String | _Optional_. List of 0-20 search keywords for the sticker with total length of up to 64 characters. For “regular” and “custom_emoji” stickers only. |

#### [](https://core.telegram.org/bots/api#sendsticker)sendSticker

Use this method to send static .WEBP, [animated](https://telegram.org/blog/animated-stickers) .TGS, or [video](https://telegram.org/blog/video-stickers-better-reactions) .WEBM stickers. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| sticker | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Yes | Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Video and animated stickers can't be sent via an HTTP URL. |
| emoji | String | Optional | Emoji associated with the sticker; only for just uploaded stickers |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) or [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup) or [ReplyKeyboardRemove](https://core.telegram.org/bots/api#replykeyboardremove) or [ForceReply](https://core.telegram.org/bots/api#forcereply) | Optional | Additional interface options. A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user |

#### [](https://core.telegram.org/bots/api#getstickerset)getStickerSet

Use this method to get a sticker set. On success, a [StickerSet](https://core.telegram.org/bots/api#stickerset) object is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| name | String | Yes | Name of the sticker set |

#### [](https://core.telegram.org/bots/api#getcustomemojistickers)getCustomEmojiStickers

Use this method to get information about custom emoji stickers by their identifiers. Returns an Array of [Sticker](https://core.telegram.org/bots/api#sticker) objects.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| custom_emoji_ids | Array of String | Yes | A JSON-serialized list of custom emoji identifiers. At most 200 custom emoji identifiers can be specified. |

#### [](https://core.telegram.org/bots/api#uploadstickerfile)uploadStickerFile

Use this method to upload a file with a sticker for later use in the [createNewStickerSet](https://core.telegram.org/bots/api#createnewstickerset), [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset), or [replaceStickerInSet](https://core.telegram.org/bots/api#replacestickerinset) methods (the file can be used multiple times). Returns the uploaded [File](https://core.telegram.org/bots/api#file) on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | User identifier of sticker file owner |
| sticker | [InputFile](https://core.telegram.org/bots/api#inputfile) | Yes | A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See [[https://core.telegram.org/stickers](https://core.telegram.org/stickers)](https://core.telegram.org/stickers) for technical requirements. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) |
| sticker_format | String | Yes | Format of the sticker, must be one of “static”, “animated”, “video” |

#### [](https://core.telegram.org/bots/api#createnewstickerset)createNewStickerSet

Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | User identifier of created sticker set owner |
| name | String | Yes | Short name of sticker set, to be used in `t.me/addstickers/` URLs (e.g., _animals_). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in `"_by_<bot_username>"`. `<bot_username>` is case insensitive. 1-64 characters. |
| title | String | Yes | Sticker set title, 1-64 characters |
| stickers | Array of [InputSticker](https://core.telegram.org/bots/api#inputsticker) | Yes | A JSON-serialized list of 1-50 initial stickers to be added to the sticker set |
| sticker_type | String | Optional | Type of stickers in the set, pass “regular”, “mask”, or “custom_emoji”. By default, a regular sticker set is created. |
| needs_repainting | Boolean | Optional | Pass _True_ if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only |

#### [](https://core.telegram.org/bots/api#addstickertoset)addStickerToSet

Use this method to add a new sticker to a set created by the bot. Emoji sticker sets can have up to 200 stickers. Other sticker sets can have up to 120 stickers. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | User identifier of sticker set owner |
| name | String | Yes | Sticker set name |
| sticker | [InputSticker](https://core.telegram.org/bots/api#inputsticker) | Yes | A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed. |

#### [](https://core.telegram.org/bots/api#setstickerpositioninset)setStickerPositionInSet

Use this method to move a sticker in a set created by the bot to a specific position. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| sticker | String | Yes | File identifier of the sticker |
| position | Integer | Yes | New sticker position in the set, zero-based |

#### [](https://core.telegram.org/bots/api#deletestickerfromset)deleteStickerFromSet

Use this method to delete a sticker from a set created by the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| sticker | String | Yes | File identifier of the sticker |

#### [](https://core.telegram.org/bots/api#replacestickerinset)replaceStickerInSet

Use this method to replace an existing sticker in a sticker set with a new one. The method is equivalent to calling [deleteStickerFromSet](https://core.telegram.org/bots/api#deletestickerfromset), then [addStickerToSet](https://core.telegram.org/bots/api#addstickertoset), then [setStickerPositionInSet](https://core.telegram.org/bots/api#setstickerpositioninset). Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | User identifier of the sticker set owner |
| name | String | Yes | Sticker set name |
| old_sticker | String | Yes | File identifier of the replaced sticker |
| sticker | [InputSticker](https://core.telegram.org/bots/api#inputsticker) | Yes | A JSON-serialized object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged. |

#### [](https://core.telegram.org/bots/api#setstickeremojilist)setStickerEmojiList

Use this method to change the list of emoji assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| sticker | String | Yes | File identifier of the sticker |
| emoji_list | Array of String | Yes | A JSON-serialized list of 1-20 emoji associated with the sticker |

#### [](https://core.telegram.org/bots/api#setstickerkeywords)setStickerKeywords

Use this method to change search keywords assigned to a regular or custom emoji sticker. The sticker must belong to a sticker set created by the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| sticker | String | Yes | File identifier of the sticker |
| keywords | Array of String | Optional | A JSON-serialized list of 0-20 search keywords for the sticker with total length of up to 64 characters |

#### [](https://core.telegram.org/bots/api#setstickermaskposition)setStickerMaskPosition

Use this method to change the [mask position](https://core.telegram.org/bots/api#maskposition) of a mask sticker. The sticker must belong to a sticker set that was created by the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| sticker | String | Yes | File identifier of the sticker |
| mask_position | [MaskPosition](https://core.telegram.org/bots/api#maskposition) | Optional | A JSON-serialized object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position. |

#### [](https://core.telegram.org/bots/api#setstickersettitle)setStickerSetTitle

Use this method to set the title of a created sticker set. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| name | String | Yes | Sticker set name |
| title | String | Yes | Sticker set title, 1-64 characters |

#### [](https://core.telegram.org/bots/api#setstickersetthumbnail)setStickerSetThumbnail

Use this method to set the thumbnail of a regular or mask sticker set. The format of the thumbnail file must match the format of the stickers in the set. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| name | String | Yes | Sticker set name |
| user_id | Integer | Yes | User identifier of the sticker set owner |
| thumbnail | [InputFile](https://core.telegram.org/bots/api#inputfile) or String | Optional | A **.WEBP** or **.PNG** image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a **.TGS** animation with a thumbnail up to 32 kilobytes in size (see [[https://core.telegram.org/stickers#animation-requirements](https://core.telegram.org/stickers#animation-requirements)](https://core.telegram.org/stickers#animation-requirements) for animated sticker technical requirements), or a **.WEBM** video with the thumbnail up to 32 kilobytes in size; see [[https://core.telegram.org/stickers#video-requirements](https://core.telegram.org/stickers#video-requirements)](https://core.telegram.org/stickers#video-requirements) for video sticker technical requirements. Pass a _file\_id_ as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail. |
| format | String | Yes | Format of the thumbnail, must be one of “static” for a **.WEBP** or **.PNG** image, “animated” for a **.TGS** animation, or “video” for a **.WEBM** video |

#### [](https://core.telegram.org/bots/api#setcustomemojistickersetthumbnail)setCustomEmojiStickerSetThumbnail

Use this method to set the thumbnail of a custom emoji sticker set. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| name | String | Yes | Sticker set name |
| custom_emoji_id | String | Optional | Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail. |

#### [](https://core.telegram.org/bots/api#deletestickerset)deleteStickerSet

Use this method to delete a sticker set that was created by the bot. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| name | String | Yes | Sticker set name |

### [](https://core.telegram.org/bots/api#inline-mode)Inline mode

The following methods and objects allow your bot to work in [inline mode](https://core.telegram.org/bots/inline).

Please see our [Introduction to Inline bots](https://core.telegram.org/bots/inline) for more details.

To enable this option, send the `/setinline` command to [@BotFather](https://t.me/botfather) and provide the placeholder text that the user will see in the input field after typing your bot's name.

#### [](https://core.telegram.org/bots/api#inlinequery)InlineQuery

This object represents an incoming inline query. When the user sends an empty query, your bot could return some default or trending results.

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique identifier for this query |
| from | [User](https://core.telegram.org/bots/api#user) | Sender |
| query | String | Text of the query (up to 256 characters) |
| offset | String | Offset of the results to be returned, can be controlled by the bot |
| chat_type | String | _Optional_. Type of the chat from which the inline query was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”. The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat |
| location | [Location](https://core.telegram.org/bots/api#location) | _Optional_. Sender location, only for bots that request user location |

#### [](https://core.telegram.org/bots/api#answerinlinequery)answerInlineQuery

Use this method to send answers to an inline query. On success, _True_ is returned.

No more than **50** results per query are allowed.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| inline_query_id | String | Yes | Unique identifier for the answered query |
| results | Array of [InlineQueryResult](https://core.telegram.org/bots/api#inlinequeryresult) | Yes | A JSON-serialized array of results for the inline query |
| cache_time | Integer | Optional | The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300. |
| is_personal | Boolean | Optional | Pass _True_ if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query. |
| next_offset | String | Optional | Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes. |
| button | [InlineQueryResultsButton](https://core.telegram.org/bots/api#inlinequeryresultsbutton) | Optional | A JSON-serialized object describing a button to be shown above inline query results |

#### [](https://core.telegram.org/bots/api#inlinequeryresultsbutton)InlineQueryResultsButton

This object represents a button to be shown above inline query results. You **must** use exactly one of the optional fields.

| Field | Type | Description |
| --- | --- | --- |
| text | String | Label text on the button |
| web_app | [WebAppInfo](https://core.telegram.org/bots/api#webappinfo) | _Optional_. Description of the [Web App](https://core.telegram.org/bots/webapps) that will be launched when the user presses the button. The Web App will be able to switch back to the inline mode using the method [switchInlineQuery](https://core.telegram.org/bots/webapps#initializing-mini-apps) inside the Web App. |
| start_parameter | String | _Optional_. [Deep-linking](https://core.telegram.org/bots/features#deep-linking) parameter for the /start message sent to the bot when a user presses the button. 1-64 characters, only `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed. _Example:_ An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a [_switch\_inline_](https://core.telegram.org/bots/api#inlinekeyboardmarkup) button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities. |

#### [](https://core.telegram.org/bots/api#inlinequeryresult)InlineQueryResult

This object represents one result of an inline query. Telegram clients currently support results of the following 20 types:

*   [InlineQueryResultCachedAudio](https://core.telegram.org/bots/api#inlinequeryresultcachedaudio)
*   [InlineQueryResultCachedDocument](https://core.telegram.org/bots/api#inlinequeryresultcacheddocument)
*   [InlineQueryResultCachedGif](https://core.telegram.org/bots/api#inlinequeryresultcachedgif)
*   [InlineQueryResultCachedMpeg4Gif](https://core.telegram.org/bots/api#inlinequeryresultcachedmpeg4gif)
*   [InlineQueryResultCachedPhoto](https://core.telegram.org/bots/api#inlinequeryresultcachedphoto)
*   [InlineQueryResultCachedSticker](https://core.telegram.org/bots/api#inlinequeryresultcachedsticker)
*   [InlineQueryResultCachedVideo](https://core.telegram.org/bots/api#inlinequeryresultcachedvideo)
*   [InlineQueryResultCachedVoice](https://core.telegram.org/bots/api#inlinequeryresultcachedvoice)
*   [InlineQueryResultArticle](https://core.telegram.org/bots/api#inlinequeryresultarticle)
*   [InlineQueryResultAudio](https://core.telegram.org/bots/api#inlinequeryresultaudio)
*   [InlineQueryResultContact](https://core.telegram.org/bots/api#inlinequeryresultcontact)
*   [InlineQueryResultGame](https://core.telegram.org/bots/api#inlinequeryresultgame)
*   [InlineQueryResultDocument](https://core.telegram.org/bots/api#inlinequeryresultdocument)
*   [InlineQueryResultGif](https://core.telegram.org/bots/api#inlinequeryresultgif)
*   [InlineQueryResultLocation](https://core.telegram.org/bots/api#inlinequeryresultlocation)
*   [InlineQueryResultMpeg4Gif](https://core.telegram.org/bots/api#inlinequeryresultmpeg4gif)
*   [InlineQueryResultPhoto](https://core.telegram.org/bots/api#inlinequeryresultphoto)
*   [InlineQueryResultVenue](https://core.telegram.org/bots/api#inlinequeryresultvenue)
*   [InlineQueryResultVideo](https://core.telegram.org/bots/api#inlinequeryresultvideo)
*   [InlineQueryResultVoice](https://core.telegram.org/bots/api#inlinequeryresultvoice)

**Note:** All URLs passed in inline query results will be available to end users and therefore must be assumed to be **public**.

#### [](https://core.telegram.org/bots/api#inlinequeryresultarticle)InlineQueryResultArticle

Represents a link to an article or web page.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _article_ |
| id | String | Unique identifier for this result, 1-64 Bytes |
| title | String | Title of the result |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | Content of the message to be sent |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| url | String | _Optional_. URL of the result |
| description | String | _Optional_. Short description of the result |
| thumbnail_url | String | _Optional_. Url of the thumbnail for the result |
| thumbnail_width | Integer | _Optional_. Thumbnail width |
| thumbnail_height | Integer | _Optional_. Thumbnail height |

#### [](https://core.telegram.org/bots/api#inlinequeryresultphoto)InlineQueryResultPhoto

Represents a link to a photo. By default, this photo will be sent by the user with optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the photo.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _photo_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| photo_url | String | A valid URL of the photo. Photo must be in **JPEG** format. Photo size must not exceed 5MB |
| thumbnail_url | String | URL of the thumbnail for the photo |
| photo_width | Integer | _Optional_. Width of the photo |
| photo_height | Integer | _Optional_. Height of the photo |
| title | String | _Optional_. Title for the result |
| description | String | _Optional_. Short description of the result |
| caption | String | _Optional_. Caption of the photo to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the photo |

#### [](https://core.telegram.org/bots/api#inlinequeryresultgif)InlineQueryResultGif

Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the animation.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _gif_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| gif_url | String | A valid URL for the GIF file |
| gif_width | Integer | _Optional_. Width of the GIF |
| gif_height | Integer | _Optional_. Height of the GIF |
| gif_duration | Integer | _Optional_. Duration of the GIF in seconds |
| thumbnail_url | String | URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result |
| thumbnail_mime_type | String | _Optional_. MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg” |
| title | String | _Optional_. Title for the result |
| caption | String | _Optional_. Caption of the GIF file to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the GIF animation |

#### [](https://core.telegram.org/bots/api#inlinequeryresultmpeg4gif)InlineQueryResultMpeg4Gif

Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the animation.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _mpeg4\_gif_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| mpeg4_url | String | A valid URL for the MPEG4 file |
| mpeg4_width | Integer | _Optional_. Video width |
| mpeg4_height | Integer | _Optional_. Video height |
| mpeg4_duration | Integer | _Optional_. Video duration in seconds |
| thumbnail_url | String | URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result |
| thumbnail_mime_type | String | _Optional_. MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg” |
| title | String | _Optional_. Title for the result |
| caption | String | _Optional_. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the video animation |

#### [](https://core.telegram.org/bots/api#inlinequeryresultvideo)InlineQueryResultVideo

Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the video.

> If an InlineQueryResultVideo message contains an embedded video (e.g., YouTube), you **must** replace its content using _input\_message\_content_.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _video_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| video_url | String | A valid URL for the embedded video player or video file |
| mime_type | String | MIME type of the content of the video URL, “text/html” or “video/mp4” |
| thumbnail_url | String | URL of the thumbnail (JPEG only) for the video |
| title | String | Title for the result |
| caption | String | _Optional_. Caption of the video to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| video_width | Integer | _Optional_. Video width |
| video_height | Integer | _Optional_. Video height |
| video_duration | Integer | _Optional_. Video duration in seconds |
| description | String | _Optional_. Short description of the result |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the video. This field is **required** if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video). |

#### [](https://core.telegram.org/bots/api#inlinequeryresultaudio)InlineQueryResultAudio

Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the audio.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _audio_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| audio_url | String | A valid URL for the audio file |
| title | String | Title |
| caption | String | _Optional_. Caption, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the audio caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| performer | String | _Optional_. Performer |
| audio_duration | Integer | _Optional_. Audio duration in seconds |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the audio |

#### [](https://core.telegram.org/bots/api#inlinequeryresultvoice)InlineQueryResultVoice

Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the the voice message.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _voice_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| voice_url | String | A valid URL for the voice recording |
| title | String | Recording title |
| caption | String | _Optional_. Caption, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the voice message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| voice_duration | Integer | _Optional_. Recording duration in seconds |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the voice recording |

#### [](https://core.telegram.org/bots/api#inlinequeryresultdocument)InlineQueryResultDocument

Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the file. Currently, only **.PDF** and **.ZIP** files can be sent using this method.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _document_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| title | String | Title for the result |
| caption | String | _Optional_. Caption of the document to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| document_url | String | A valid URL for the file |
| mime_type | String | MIME type of the content of the file, either “application/pdf” or “application/zip” |
| description | String | _Optional_. Short description of the result |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. Inline keyboard attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the file |
| thumbnail_url | String | _Optional_. URL of the thumbnail (JPEG only) for the file |
| thumbnail_width | Integer | _Optional_. Thumbnail width |
| thumbnail_height | Integer | _Optional_. Thumbnail height |

#### [](https://core.telegram.org/bots/api#inlinequeryresultlocation)InlineQueryResultLocation

Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the location.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _location_ |
| id | String | Unique identifier for this result, 1-64 Bytes |
| latitude | Float | Location latitude in degrees |
| longitude | Float | Location longitude in degrees |
| title | String | Location title |
| horizontal_accuracy | Float | _Optional_. The radius of uncertainty for the location, measured in meters; 0-1500 |
| live_period | Integer | _Optional_. Period in seconds during which the location can be updated, should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. |
| heading | Integer | _Optional_. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. |
| proximity_alert_radius | Integer | _Optional_. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the location |
| thumbnail_url | String | _Optional_. Url of the thumbnail for the result |
| thumbnail_width | Integer | _Optional_. Thumbnail width |
| thumbnail_height | Integer | _Optional_. Thumbnail height |

#### [](https://core.telegram.org/bots/api#inlinequeryresultvenue)InlineQueryResultVenue

Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the venue.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _venue_ |
| id | String | Unique identifier for this result, 1-64 Bytes |
| latitude | Float | Latitude of the venue location in degrees |
| longitude | Float | Longitude of the venue location in degrees |
| title | String | Title of the venue |
| address | String | Address of the venue |
| foursquare_id | String | _Optional_. Foursquare identifier of the venue if known |
| foursquare_type | String | _Optional_. Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) |
| google_place_id | String | _Optional_. Google Places identifier of the venue |
| google_place_type | String | _Optional_. Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).) |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the venue |
| thumbnail_url | String | _Optional_. Url of the thumbnail for the result |
| thumbnail_width | Integer | _Optional_. Thumbnail width |
| thumbnail_height | Integer | _Optional_. Thumbnail height |

#### [](https://core.telegram.org/bots/api#inlinequeryresultcontact)InlineQueryResultContact

Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the contact.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _contact_ |
| id | String | Unique identifier for this result, 1-64 Bytes |
| phone_number | String | Contact's phone number |
| first_name | String | Contact's first name |
| last_name | String | _Optional_. Contact's last name |
| vcard | String | _Optional_. Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard), 0-2048 bytes |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the contact |
| thumbnail_url | String | _Optional_. Url of the thumbnail for the result |
| thumbnail_width | Integer | _Optional_. Thumbnail width |
| thumbnail_height | Integer | _Optional_. Thumbnail height |

#### [](https://core.telegram.org/bots/api#inlinequeryresultgame)InlineQueryResultGame

Represents a [Game](https://core.telegram.org/bots/api#games).

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _game_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| game_short_name | String | Short name of the game |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |

#### [](https://core.telegram.org/bots/api#inlinequeryresultcachedphoto)InlineQueryResultCachedPhoto

Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the photo.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _photo_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| photo_file_id | String | A valid file identifier of the photo |
| title | String | _Optional_. Title for the result |
| description | String | _Optional_. Short description of the result |
| caption | String | _Optional_. Caption of the photo to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the photo |

#### [](https://core.telegram.org/bots/api#inlinequeryresultcachedgif)InlineQueryResultCachedGif

Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with specified content instead of the animation.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _gif_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| gif_file_id | String | A valid file identifier for the GIF file |
| title | String | _Optional_. Title for the result |
| caption | String | _Optional_. Caption of the GIF file to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the GIF animation |

#### [](https://core.telegram.org/bots/api#inlinequeryresultcachedmpeg4gif)InlineQueryResultCachedMpeg4Gif

Represents a link to a video animation (H.264/MPEG-4 AVC video without sound) stored on the Telegram servers. By default, this animated MPEG-4 file will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the animation.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _mpeg4\_gif_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| mpeg4_file_id | String | A valid file identifier for the MPEG4 file |
| title | String | _Optional_. Title for the result |
| caption | String | _Optional_. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the video animation |

#### [](https://core.telegram.org/bots/api#inlinequeryresultcachedsticker)InlineQueryResultCachedSticker

Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the sticker.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _sticker_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| sticker_file_id | String | A valid file identifier of the sticker |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the sticker |

#### [](https://core.telegram.org/bots/api#inlinequeryresultcacheddocument)InlineQueryResultCachedDocument

Represents a link to a file stored on the Telegram servers. By default, this file will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the file.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _document_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| title | String | Title for the result |
| document_file_id | String | A valid file identifier for the file |
| description | String | _Optional_. Short description of the result |
| caption | String | _Optional_. Caption of the document to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the file |

#### [](https://core.telegram.org/bots/api#inlinequeryresultcachedvideo)InlineQueryResultCachedVideo

Represents a link to a video file stored on the Telegram servers. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the video.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _video_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| video_file_id | String | A valid file identifier for the video file |
| title | String | Title for the result |
| description | String | _Optional_. Short description of the result |
| caption | String | _Optional_. Caption of the video to be sent, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| show_caption_above_media | Boolean | _Optional_. Pass _True_, if the caption must be shown above the message media |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the video |

#### [](https://core.telegram.org/bots/api#inlinequeryresultcachedvoice)InlineQueryResultCachedVoice

Represents a link to a voice message stored on the Telegram servers. By default, this voice message will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the voice message.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _voice_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| voice_file_id | String | A valid file identifier for the voice message |
| title | String | Voice message title |
| caption | String | _Optional_. Caption, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the voice message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the voice message |

#### [](https://core.telegram.org/bots/api#inlinequeryresultcachedaudio)InlineQueryResultCachedAudio

Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use _input\_message\_content_ to send a message with the specified content instead of the audio.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the result, must be _audio_ |
| id | String | Unique identifier for this result, 1-64 bytes |
| audio_file_id | String | A valid file identifier for the audio file |
| caption | String | _Optional_. Caption, 0-1024 characters after entities parsing |
| parse_mode | String | _Optional_. Mode for parsing entities in the audio caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| caption_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in the caption, which can be specified instead of _parse\_mode_ |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | _Optional_. [Inline keyboard](https://core.telegram.org/bots/features#inline-keyboards) attached to the message |
| input_message_content | [InputMessageContent](https://core.telegram.org/bots/api#inputmessagecontent) | _Optional_. Content of the message to be sent instead of the audio |

#### [](https://core.telegram.org/bots/api#inputmessagecontent)InputMessageContent

This object represents the content of a message to be sent as a result of an inline query. Telegram clients currently support the following 5 types:

*   [InputTextMessageContent](https://core.telegram.org/bots/api#inputtextmessagecontent)
*   [InputLocationMessageContent](https://core.telegram.org/bots/api#inputlocationmessagecontent)
*   [InputVenueMessageContent](https://core.telegram.org/bots/api#inputvenuemessagecontent)
*   [InputContactMessageContent](https://core.telegram.org/bots/api#inputcontactmessagecontent)
*   [InputInvoiceMessageContent](https://core.telegram.org/bots/api#inputinvoicemessagecontent)

#### [](https://core.telegram.org/bots/api#inputtextmessagecontent)InputTextMessageContent

Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a text message to be sent as the result of an inline query.

| Field | Type | Description |
| --- | --- | --- |
| message_text | String | Text of the message to be sent, 1-4096 characters |
| parse_mode | String | _Optional_. Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. |
| entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. List of special entities that appear in message text, which can be specified instead of _parse\_mode_ |
| link_preview_options | [LinkPreviewOptions](https://core.telegram.org/bots/api#linkpreviewoptions) | _Optional_. Link preview generation options for the message |

#### [](https://core.telegram.org/bots/api#inputlocationmessagecontent)InputLocationMessageContent

Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a location message to be sent as the result of an inline query.

| Field | Type | Description |
| --- | --- | --- |
| latitude | Float | Latitude of the location in degrees |
| longitude | Float | Longitude of the location in degrees |
| horizontal_accuracy | Float | _Optional_. The radius of uncertainty for the location, measured in meters; 0-1500 |
| live_period | Integer | _Optional_. Period in seconds during which the location can be updated, should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. |
| heading | Integer | _Optional_. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. |
| proximity_alert_radius | Integer | _Optional_. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. |

#### [](https://core.telegram.org/bots/api#inputvenuemessagecontent)InputVenueMessageContent

Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a venue message to be sent as the result of an inline query.

| Field | Type | Description |
| --- | --- | --- |
| latitude | Float | Latitude of the venue in degrees |
| longitude | Float | Longitude of the venue in degrees |
| title | String | Name of the venue |
| address | String | Address of the venue |
| foursquare_id | String | _Optional_. Foursquare identifier of the venue, if known |
| foursquare_type | String | _Optional_. Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) |
| google_place_id | String | _Optional_. Google Places identifier of the venue |
| google_place_type | String | _Optional_. Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).) |

#### [](https://core.telegram.org/bots/api#inputcontactmessagecontent)InputContactMessageContent

Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a contact message to be sent as the result of an inline query.

| Field | Type | Description |
| --- | --- | --- |
| phone_number | String | Contact's phone number |
| first_name | String | Contact's first name |
| last_name | String | _Optional_. Contact's last name |
| vcard | String | _Optional_. Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard), 0-2048 bytes |

#### [](https://core.telegram.org/bots/api#inputinvoicemessagecontent)InputInvoiceMessageContent

Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of an invoice message to be sent as the result of an inline query.

| Field | Type | Description |
| --- | --- | --- |
| title | String | Product name, 1-32 characters |
| description | String | Product description, 1-255 characters |
| payload | String | Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. |
| provider_token | String | _Optional_. Payment provider token, obtained via [@BotFather](https://t.me/botfather). Pass an empty string for payments in [Telegram Stars](https://t.me/BotNews/90). |
| currency | String | Three-letter ISO 4217 currency code, see [more on currencies](https://core.telegram.org/bots/payments#supported-currencies). Pass “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90). |
| prices | Array of [LabeledPrice](https://core.telegram.org/bots/api#labeledprice) | Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in [Telegram Stars](https://t.me/BotNews/90). |
| max_tip_amount | Integer | _Optional_. The maximum accepted amount for tips in the _smallest units_ of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in [Telegram Stars](https://t.me/BotNews/90). |
| suggested_tip_amounts | Array of Integer | _Optional_. A JSON-serialized array of suggested amounts of tip in the _smallest units_ of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed _max\_tip\_amount_. |
| provider_data | String | _Optional_. A JSON-serialized object for data about the invoice, which will be shared with the payment provider. A detailed description of the required fields should be provided by the payment provider. |
| photo_url | String | _Optional_. URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. |
| photo_size | Integer | _Optional_. Photo size in bytes |
| photo_width | Integer | _Optional_. Photo width |
| photo_height | Integer | _Optional_. Photo height |
| need_name | Boolean | _Optional_. Pass _True_ if you require the user's full name to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| need_phone_number | Boolean | _Optional_. Pass _True_ if you require the user's phone number to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| need_email | Boolean | _Optional_. Pass _True_ if you require the user's email address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| need_shipping_address | Boolean | _Optional_. Pass _True_ if you require the user's shipping address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| send_phone_number_to_provider | Boolean | _Optional_. Pass _True_ if the user's phone number should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| send_email_to_provider | Boolean | _Optional_. Pass _True_ if the user's email address should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| is_flexible | Boolean | _Optional_. Pass _True_ if the final price depends on the shipping method. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |

#### [](https://core.telegram.org/bots/api#choseninlineresult)ChosenInlineResult

Represents a [result](https://core.telegram.org/bots/api#inlinequeryresult) of an inline query that was chosen by the user and sent to their chat partner.

| Field | Type | Description |
| --- | --- | --- |
| result_id | String | The unique identifier for the result that was chosen |
| from | [User](https://core.telegram.org/bots/api#user) | The user that chose the result |
| location | [Location](https://core.telegram.org/bots/api#location) | _Optional_. Sender location, only for bots that require user location |
| inline_message_id | String | _Optional_. Identifier of the sent inline message. Available only if there is an [inline keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup) attached to the message. Will be also received in [callback queries](https://core.telegram.org/bots/api#callbackquery) and can be used to [edit](https://core.telegram.org/bots/api#updating-messages) the message. |
| query | String | The query that was used to obtain the result |

**Note:** It is necessary to enable [inline feedback](https://core.telegram.org/bots/inline#collecting-feedback) via [@BotFather](https://t.me/botfather) in order to receive these objects in updates.

#### [](https://core.telegram.org/bots/api#answerwebappquery)answerWebAppQuery

Use this method to set the result of an interaction with a [Web App](https://core.telegram.org/bots/webapps) and send a corresponding message on behalf of the user to the chat from which the query originated. On success, a [SentWebAppMessage](https://core.telegram.org/bots/api#sentwebappmessage) object is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| web_app_query_id | String | Yes | Unique identifier for the query to be answered |
| result | [InlineQueryResult](https://core.telegram.org/bots/api#inlinequeryresult) | Yes | A JSON-serialized object describing the message to be sent |

#### [](https://core.telegram.org/bots/api#sentwebappmessage)SentWebAppMessage

Describes an inline message sent by a [Web App](https://core.telegram.org/bots/webapps) on behalf of a user.

| Field | Type | Description |
| --- | --- | --- |
| inline_message_id | String | _Optional_. Identifier of the sent inline message. Available only if there is an [inline keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup) attached to the message. |

#### [](https://core.telegram.org/bots/api#savepreparedinlinemessage)savePreparedInlineMessage

Stores a message that can be sent by a user of a Mini App. Returns a [PreparedInlineMessage](https://core.telegram.org/bots/api#preparedinlinemessage) object.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | Unique identifier of the target user that can use the prepared message |
| result | [InlineQueryResult](https://core.telegram.org/bots/api#inlinequeryresult) | Yes | A JSON-serialized object describing the message to be sent |
| allow_user_chats | Boolean | Optional | Pass _True_ if the message can be sent to private chats with users |
| allow_bot_chats | Boolean | Optional | Pass _True_ if the message can be sent to private chats with bots |
| allow_group_chats | Boolean | Optional | Pass _True_ if the message can be sent to group and supergroup chats |
| allow_channel_chats | Boolean | Optional | Pass _True_ if the message can be sent to channel chats |

#### [](https://core.telegram.org/bots/api#preparedinlinemessage)PreparedInlineMessage

Describes an inline message to be sent by a user of a Mini App.

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique identifier of the prepared message |
| expiration_date | Integer | Expiration date of the prepared message, in Unix time. Expired prepared messages can no longer be used |

### [](https://core.telegram.org/bots/api#payments)Payments

Your bot can accept payments from Telegram users. Please see the [introduction to payments](https://core.telegram.org/bots/payments) for more details on the process and how to set up payments for your bot.

#### [](https://core.telegram.org/bots/api#sendinvoice)sendInvoice

Use this method to send invoices. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| chat_id | Integer or String | Yes | Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| direct_messages_topic_id | Integer | Optional | Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat |
| title | String | Yes | Product name, 1-32 characters |
| description | String | Yes | Product description, 1-255 characters |
| payload | String | Yes | Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. |
| provider_token | String | Optional | Payment provider token, obtained via [@BotFather](https://t.me/botfather). Pass an empty string for payments in [Telegram Stars](https://t.me/BotNews/90). |
| currency | String | Yes | Three-letter ISO 4217 currency code, see [more on currencies](https://core.telegram.org/bots/payments#supported-currencies). Pass “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90). |
| prices | Array of [LabeledPrice](https://core.telegram.org/bots/api#labeledprice) | Yes | Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in [Telegram Stars](https://t.me/BotNews/90). |
| max_tip_amount | Integer | Optional | The maximum accepted amount for tips in the _smallest units_ of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in [Telegram Stars](https://t.me/BotNews/90). |
| suggested_tip_amounts | Array of Integer | Optional | A JSON-serialized array of suggested amounts of tips in the _smallest units_ of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed _max\_tip\_amount_. |
| start_parameter | String | Optional | Unique deep-linking parameter. If left empty, **forwarded copies** of the sent message will have a _Pay_ button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a _URL_ button with a deep link to the bot (instead of a _Pay_ button), with the value used as the start parameter |
| provider_data | String | Optional | JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. |
| photo_url | String | Optional | URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for. |
| photo_size | Integer | Optional | Photo size in bytes |
| photo_width | Integer | Optional | Photo width |
| photo_height | Integer | Optional | Photo height |
| need_name | Boolean | Optional | Pass _True_ if you require the user's full name to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| need_phone_number | Boolean | Optional | Pass _True_ if you require the user's phone number to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| need_email | Boolean | Optional | Pass _True_ if you require the user's email address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| need_shipping_address | Boolean | Optional | Pass _True_ if you require the user's shipping address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| send_phone_number_to_provider | Boolean | Optional | Pass _True_ if the user's phone number should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| send_email_to_provider | Boolean | Optional | Pass _True_ if the user's email address should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| is_flexible | Boolean | Optional | Pass _True_ if the final price depends on the shipping method. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| suggested_post_parameters | [SuggestedPostParameters](https://core.telegram.org/bots/api#suggestedpostparameters) | Optional | A JSON-serialized object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). If empty, one 'Pay `total price`' button will be shown. If not empty, the first button must be a Pay button. |

#### [](https://core.telegram.org/bots/api#createinvoicelink)createInvoiceLink

Use this method to create a link for an invoice. Returns the created invoice link as _String_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the link will be created. For payments in [Telegram Stars](https://t.me/BotNews/90) only. |
| title | String | Yes | Product name, 1-32 characters |
| description | String | Yes | Product description, 1-255 characters |
| payload | String | Yes | Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. |
| provider_token | String | Optional | Payment provider token, obtained via [@BotFather](https://t.me/botfather). Pass an empty string for payments in [Telegram Stars](https://t.me/BotNews/90). |
| currency | String | Yes | Three-letter ISO 4217 currency code, see [more on currencies](https://core.telegram.org/bots/payments#supported-currencies). Pass “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90). |
| prices | Array of [LabeledPrice](https://core.telegram.org/bots/api#labeledprice) | Yes | Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in [Telegram Stars](https://t.me/BotNews/90). |
| subscription_period | Integer | Optional | The number of seconds the subscription will be active for before the next payment. The currency must be set to “XTR” (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars. |
| max_tip_amount | Integer | Optional | The maximum accepted amount for tips in the _smallest units_ of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in [Telegram Stars](https://t.me/BotNews/90). |
| suggested_tip_amounts | Array of Integer | Optional | A JSON-serialized array of suggested amounts of tips in the _smallest units_ of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed _max\_tip\_amount_. |
| provider_data | String | Optional | JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. |
| photo_url | String | Optional | URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. |
| photo_size | Integer | Optional | Photo size in bytes |
| photo_width | Integer | Optional | Photo width |
| photo_height | Integer | Optional | Photo height |
| need_name | Boolean | Optional | Pass _True_ if you require the user's full name to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| need_phone_number | Boolean | Optional | Pass _True_ if you require the user's phone number to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| need_email | Boolean | Optional | Pass _True_ if you require the user's email address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| need_shipping_address | Boolean | Optional | Pass _True_ if you require the user's shipping address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| send_phone_number_to_provider | Boolean | Optional | Pass _True_ if the user's phone number should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| send_email_to_provider | Boolean | Optional | Pass _True_ if the user's email address should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |
| is_flexible | Boolean | Optional | Pass _True_ if the final price depends on the shipping method. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). |

#### [](https://core.telegram.org/bots/api#answershippingquery)answerShippingQuery

If you sent an invoice requesting a shipping address and the parameter _is\_flexible_ was specified, the Bot API will send an [Update](https://core.telegram.org/bots/api#update) with a _shipping\_query_ field to the bot. Use this method to reply to shipping queries. On success, _True_ is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| shipping_query_id | String | Yes | Unique identifier for the query to be answered |
| ok | Boolean | Yes | Pass _True_ if delivery to the specified address is possible and _False_ if there are any problems (for example, if delivery to the specified address is not possible) |
| shipping_options | Array of [ShippingOption](https://core.telegram.org/bots/api#shippingoption) | Optional | Required if _ok_ is _True_. A JSON-serialized array of available shipping options. |
| error_message | String | Optional | Required if _ok_ is _False_. Error message in human readable form that explains why it is impossible to complete the order (e.g. “Sorry, delivery to your desired address is unavailable”). Telegram will display this message to the user. |

#### [](https://core.telegram.org/bots/api#answerprecheckoutquery)answerPreCheckoutQuery

Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an [Update](https://core.telegram.org/bots/api#update) with the field _pre\_checkout\_query_. Use this method to respond to such pre-checkout queries. On success, _True_ is returned. **Note:** The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| pre_checkout_query_id | String | Yes | Unique identifier for the query to be answered |
| ok | Boolean | Yes | Specify _True_ if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use _False_ if there are any problems. |
| error_message | String | Optional | Required if _ok_ is _False_. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user. |

#### [](https://core.telegram.org/bots/api#getmystarbalance)getMyStarBalance

A method to get the current Telegram Stars balance of the bot. Requires no parameters. On success, returns a [StarAmount](https://core.telegram.org/bots/api#staramount) object.

#### [](https://core.telegram.org/bots/api#getstartransactions)getStarTransactions

Returns the bot's Telegram Star transactions in chronological order. On success, returns a [StarTransactions](https://core.telegram.org/bots/api#startransactions) object.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| offset | Integer | Optional | Number of transactions to skip in the response |
| limit | Integer | Optional | The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100. |

#### [](https://core.telegram.org/bots/api#refundstarpayment)refundStarPayment

Refunds a successful payment in [Telegram Stars](https://t.me/BotNews/90). Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | Identifier of the user whose payment will be refunded |
| telegram_payment_charge_id | String | Yes | Telegram payment identifier |

#### [](https://core.telegram.org/bots/api#edituserstarsubscription)editUserStarSubscription

Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. Returns _True_ on success.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | Identifier of the user whose subscription will be edited |
| telegram_payment_charge_id | String | Yes | Telegram payment identifier for the subscription |
| is_canceled | Boolean | Yes | Pass _True_ to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass _False_ to allow the user to re-enable a subscription that was previously canceled by the bot. |

#### [](https://core.telegram.org/bots/api#labeledprice)LabeledPrice

This object represents a portion of the price for goods or services.

| Field | Type | Description |
| --- | --- | --- |
| label | String | Portion label |
| amount | Integer | Price of the product in the _smallest units_ of the [currency](https://core.telegram.org/bots/payments#supported-currencies) (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). |

#### [](https://core.telegram.org/bots/api#invoice)Invoice

This object contains basic information about an invoice.

| Field | Type | Description |
| --- | --- | --- |
| title | String | Product name |
| description | String | Product description |
| start_parameter | String | Unique bot deep-linking parameter that can be used to generate this invoice |
| currency | String | Three-letter ISO 4217 [currency](https://core.telegram.org/bots/payments#supported-currencies) code, or “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90) |
| total_amount | Integer | Total price in the _smallest units_ of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). |

#### [](https://core.telegram.org/bots/api#shippingaddress)ShippingAddress

This object represents a shipping address.

| Field | Type | Description |
| --- | --- | --- |
| country_code | String | Two-letter [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code |
| state | String | State, if applicable |
| city | String | City |
| street_line1 | String | First line for the address |
| street_line2 | String | Second line for the address |
| post_code | String | Address post code |

#### [](https://core.telegram.org/bots/api#orderinfo)OrderInfo

This object represents information about an order.

| Field | Type | Description |
| --- | --- | --- |
| name | String | _Optional_. User name |
| phone_number | String | _Optional_. User's phone number |
| email | String | _Optional_. User email |
| shipping_address | [ShippingAddress](https://core.telegram.org/bots/api#shippingaddress) | _Optional_. User shipping address |

#### [](https://core.telegram.org/bots/api#shippingoption)ShippingOption

This object represents one shipping option.

| Field | Type | Description |
| --- | --- | --- |
| id | String | Shipping option identifier |
| title | String | Option title |
| prices | Array of [LabeledPrice](https://core.telegram.org/bots/api#labeledprice) | List of price portions |

#### [](https://core.telegram.org/bots/api#successfulpayment)SuccessfulPayment

This object contains basic information about a successful payment. Note that if the buyer initiates a chargeback with the relevant payment provider following this transaction, the funds may be debited from your balance. This is outside of Telegram's control.

| Field | Type | Description |
| --- | --- | --- |
| currency | String | Three-letter ISO 4217 [currency](https://core.telegram.org/bots/payments#supported-currencies) code, or “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90) |
| total_amount | Integer | Total price in the _smallest units_ of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). |
| invoice_payload | String | Bot-specified invoice payload |
| subscription_expiration_date | Integer | _Optional_. Expiration date of the subscription, in Unix time; for recurring payments only |
| is_recurring | True | _Optional_. _True_, if the payment is a recurring payment for a subscription |
| is_first_recurring | True | _Optional_. _True_, if the payment is the first payment for a subscription |
| shipping_option_id | String | _Optional_. Identifier of the shipping option chosen by the user |
| order_info | [OrderInfo](https://core.telegram.org/bots/api#orderinfo) | _Optional_. Order information provided by the user |
| telegram_payment_charge_id | String | Telegram payment identifier |
| provider_payment_charge_id | String | Provider payment identifier |

#### [](https://core.telegram.org/bots/api#refundedpayment)RefundedPayment

This object contains basic information about a refunded payment.

| Field | Type | Description |
| --- | --- | --- |
| currency | String | Three-letter ISO 4217 [currency](https://core.telegram.org/bots/payments#supported-currencies) code, or “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90). Currently, always “XTR” |
| total_amount | Integer | Total refunded price in the _smallest units_ of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45`, `total_amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). |
| invoice_payload | String | Bot-specified invoice payload |
| telegram_payment_charge_id | String | Telegram payment identifier |
| provider_payment_charge_id | String | _Optional_. Provider payment identifier |

#### [](https://core.telegram.org/bots/api#shippingquery)ShippingQuery

This object contains information about an incoming shipping query.

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique query identifier |
| from | [User](https://core.telegram.org/bots/api#user) | User who sent the query |
| invoice_payload | String | Bot-specified invoice payload |
| shipping_address | [ShippingAddress](https://core.telegram.org/bots/api#shippingaddress) | User specified shipping address |

#### [](https://core.telegram.org/bots/api#precheckoutquery)PreCheckoutQuery

This object contains information about an incoming pre-checkout query.

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique query identifier |
| from | [User](https://core.telegram.org/bots/api#user) | User who sent the query |
| currency | String | Three-letter ISO 4217 [currency](https://core.telegram.org/bots/payments#supported-currencies) code, or “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90) |
| total_amount | Integer | Total price in the _smallest units_ of the currency (integer, **not** float/double). For example, for a price of `US$ 1.45` pass `amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). |
| invoice_payload | String | Bot-specified invoice payload |
| shipping_option_id | String | _Optional_. Identifier of the shipping option chosen by the user |
| order_info | [OrderInfo](https://core.telegram.org/bots/api#orderinfo) | _Optional_. Order information provided by the user |

#### [](https://core.telegram.org/bots/api#paidmediapurchased)PaidMediaPurchased

This object contains information about a paid media purchase.

| Field | Type | Description |
| --- | --- | --- |
| from | [User](https://core.telegram.org/bots/api#user) | User who purchased the media |
| paid_media_payload | String | Bot-specified paid media payload |

#### [](https://core.telegram.org/bots/api#revenuewithdrawalstate)RevenueWithdrawalState

This object describes the state of a revenue withdrawal operation. Currently, it can be one of

*   [RevenueWithdrawalStatePending](https://core.telegram.org/bots/api#revenuewithdrawalstatepending)
*   [RevenueWithdrawalStateSucceeded](https://core.telegram.org/bots/api#revenuewithdrawalstatesucceeded)
*   [RevenueWithdrawalStateFailed](https://core.telegram.org/bots/api#revenuewithdrawalstatefailed)

#### [](https://core.telegram.org/bots/api#revenuewithdrawalstatepending)RevenueWithdrawalStatePending

The withdrawal is in progress.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the state, always “pending” |

#### [](https://core.telegram.org/bots/api#revenuewithdrawalstatesucceeded)RevenueWithdrawalStateSucceeded

The withdrawal succeeded.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the state, always “succeeded” |
| date | Integer | Date the withdrawal was completed in Unix time |
| url | String | An HTTPS URL that can be used to see transaction details |

#### [](https://core.telegram.org/bots/api#revenuewithdrawalstatefailed)RevenueWithdrawalStateFailed

The withdrawal failed and the transaction was refunded.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the state, always “failed” |

#### [](https://core.telegram.org/bots/api#affiliateinfo)AffiliateInfo

Contains information about the affiliate that received a commission via this transaction.

| Field | Type | Description |
| --- | --- | --- |
| affiliate_user | [User](https://core.telegram.org/bots/api#user) | _Optional_. The bot or the user that received an affiliate commission if it was received by a bot or a user |
| affiliate_chat | [Chat](https://core.telegram.org/bots/api#chat) | _Optional_. The chat that received an affiliate commission if it was received by a chat |
| commission_per_mille | Integer | The number of Telegram Stars received by the affiliate for each 1000 Telegram Stars received by the bot from referred users |
| amount | Integer | Integer amount of Telegram Stars received by the affiliate from the transaction, rounded to 0; can be negative for refunds |
| nanostar_amount | Integer | _Optional_. The number of 1/1000000000 shares of Telegram Stars received by the affiliate; from -999999999 to 999999999; can be negative for refunds |

#### [](https://core.telegram.org/bots/api#transactionpartner)TransactionPartner

This object describes the source of a transaction, or its recipient for outgoing transactions. Currently, it can be one of

*   [TransactionPartnerUser](https://core.telegram.org/bots/api#transactionpartneruser)
*   [TransactionPartnerChat](https://core.telegram.org/bots/api#transactionpartnerchat)
*   [TransactionPartnerAffiliateProgram](https://core.telegram.org/bots/api#transactionpartneraffiliateprogram)
*   [TransactionPartnerFragment](https://core.telegram.org/bots/api#transactionpartnerfragment)
*   [TransactionPartnerTelegramAds](https://core.telegram.org/bots/api#transactionpartnertelegramads)
*   [TransactionPartnerTelegramApi](https://core.telegram.org/bots/api#transactionpartnertelegramapi)
*   [TransactionPartnerOther](https://core.telegram.org/bots/api#transactionpartnerother)

#### [](https://core.telegram.org/bots/api#transactionpartneruser)TransactionPartnerUser

Describes a transaction with a user.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the transaction partner, always “user” |
| transaction_type | String | Type of the transaction, currently one of “invoice_payment” for payments via invoices, “paid_media_payment” for payments for paid media, “gift_purchase” for gifts sent by the bot, “premium_purchase” for Telegram Premium subscriptions gifted by the bot, “business_account_transfer” for direct transfers from managed business accounts |
| user | [User](https://core.telegram.org/bots/api#user) | Information about the user |
| affiliate | [AffiliateInfo](https://core.telegram.org/bots/api#affiliateinfo) | _Optional_. Information about the affiliate that received a commission via this transaction. Can be available only for “invoice_payment” and “paid_media_payment” transactions. |
| invoice_payload | String | _Optional_. Bot-specified invoice payload. Can be available only for “invoice_payment” transactions. |
| subscription_period | Integer | _Optional_. The duration of the paid subscription. Can be available only for “invoice_payment” transactions. |
| paid_media | Array of [PaidMedia](https://core.telegram.org/bots/api#paidmedia) | _Optional_. Information about the paid media bought by the user; for “paid_media_payment” transactions only |
| paid_media_payload | String | _Optional_. Bot-specified paid media payload. Can be available only for “paid_media_payment” transactions. |
| gift | [Gift](https://core.telegram.org/bots/api#gift) | _Optional_. The gift sent to the user by the bot; for “gift_purchase” transactions only |
| premium_subscription_duration | Integer | _Optional_. Number of months the gifted Telegram Premium subscription will be active for; for “premium_purchase” transactions only |

#### [](https://core.telegram.org/bots/api#transactionpartnerchat)TransactionPartnerChat

Describes a transaction with a chat.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the transaction partner, always “chat” |
| chat | [Chat](https://core.telegram.org/bots/api#chat) | Information about the chat |
| gift | [Gift](https://core.telegram.org/bots/api#gift) | _Optional_. The gift sent to the chat by the bot |

#### [](https://core.telegram.org/bots/api#transactionpartneraffiliateprogram)TransactionPartnerAffiliateProgram

Describes the affiliate program that issued the affiliate commission received via this transaction.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the transaction partner, always “affiliate_program” |
| sponsor_user | [User](https://core.telegram.org/bots/api#user) | _Optional_. Information about the bot that sponsored the affiliate program |
| commission_per_mille | Integer | The number of Telegram Stars received by the bot for each 1000 Telegram Stars received by the affiliate program sponsor from referred users |

#### [](https://core.telegram.org/bots/api#transactionpartnerfragment)TransactionPartnerFragment

Describes a withdrawal transaction with Fragment.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the transaction partner, always “fragment” |
| withdrawal_state | [RevenueWithdrawalState](https://core.telegram.org/bots/api#revenuewithdrawalstate) | _Optional_. State of the transaction if the transaction is outgoing |

#### [](https://core.telegram.org/bots/api#transactionpartnertelegramads)TransactionPartnerTelegramAds

Describes a withdrawal transaction to the Telegram Ads platform.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the transaction partner, always “telegram_ads” |

#### [](https://core.telegram.org/bots/api#transactionpartnertelegramapi)TransactionPartnerTelegramApi

Describes a transaction with payment for [paid broadcasting](https://core.telegram.org/bots/api#paid-broadcasts).

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the transaction partner, always “telegram_api” |
| request_count | Integer | The number of successful requests that exceeded regular limits and were therefore billed |

#### [](https://core.telegram.org/bots/api#transactionpartnerother)TransactionPartnerOther

Describes a transaction with an unknown source or recipient.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Type of the transaction partner, always “other” |

#### [](https://core.telegram.org/bots/api#startransaction)StarTransaction

Describes a Telegram Star transaction. Note that if the buyer initiates a chargeback with the payment provider from whom they acquired Stars (e.g., Apple, Google) following this transaction, the refunded Stars will be deducted from the bot's balance. This is outside of Telegram's control.

| Field | Type | Description |
| --- | --- | --- |
| id | String | Unique identifier of the transaction. Coincides with the identifier of the original transaction for refund transactions. Coincides with _SuccessfulPayment.telegram\_payment\_charge\_id_ for successful incoming payments from users. |
| amount | Integer | Integer amount of Telegram Stars transferred by the transaction |
| nanostar_amount | Integer | _Optional_. The number of 1/1000000000 shares of Telegram Stars transferred by the transaction; from 0 to 999999999 |
| date | Integer | Date the transaction was created in Unix time |
| source | [TransactionPartner](https://core.telegram.org/bots/api#transactionpartner) | _Optional_. Source of an incoming transaction (e.g., a user purchasing goods or services, Fragment refunding a failed withdrawal). Only for incoming transactions |
| receiver | [TransactionPartner](https://core.telegram.org/bots/api#transactionpartner) | _Optional_. Receiver of an outgoing transaction (e.g., a user for a purchase refund, Fragment for a withdrawal). Only for outgoing transactions |

#### [](https://core.telegram.org/bots/api#startransactions)StarTransactions

Contains a list of Telegram Star transactions.

| Field | Type | Description |
| --- | --- | --- |
| transactions | Array of [StarTransaction](https://core.telegram.org/bots/api#startransaction) | The list of transactions |

### [](https://core.telegram.org/bots/api#telegram-passport)Telegram Passport

**Telegram Passport** is a unified authorization method for services that require personal identification. Users can upload their documents once, then instantly share their data with services that require real-world ID (finance, ICOs, etc.). Please see the [manual](https://core.telegram.org/passport) for details.

#### [](https://core.telegram.org/bots/api#passportdata)PassportData

Describes Telegram Passport data shared with the bot by the user.

| Field | Type | Description |
| --- | --- | --- |
| data | Array of [EncryptedPassportElement](https://core.telegram.org/bots/api#encryptedpassportelement) | Array with information about documents and other Telegram Passport elements that was shared with the bot |
| credentials | [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials) | Encrypted credentials required to decrypt the data |

#### [](https://core.telegram.org/bots/api#passportfile)PassportFile

This object represents a file uploaded to Telegram Passport. Currently all Telegram Passport files are in JPEG format when decrypted and don't exceed 10MB.

| Field | Type | Description |
| --- | --- | --- |
| file_id | String | Identifier for this file, which can be used to download or reuse the file |
| file_unique_id | String | Unique identifier for this file, which is supposed to be the same over time and for different bots. Can't be used to download or reuse the file. |
| file_size | Integer | File size in bytes |
| file_date | Integer | Unix time when the file was uploaded |

#### [](https://core.telegram.org/bots/api#encryptedpassportelement)EncryptedPassportElement

Describes documents or other Telegram Passport elements shared with the bot by the user.

| Field | Type | Description |
| --- | --- | --- |
| type | String | Element type. One of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”, “phone_number”, “email”. |
| data | String | _Optional_. Base64-encoded encrypted Telegram Passport element data provided by the user; available only for “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport” and “address” types. Can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). |
| phone_number | String | _Optional_. User's verified phone number; available only for “phone_number” type |
| email | String | _Optional_. User's verified email address; available only for “email” type |
| files | Array of [PassportFile](https://core.telegram.org/bots/api#passportfile) | _Optional_. Array of encrypted files with documents provided by the user; available only for “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). |
| front_side | [PassportFile](https://core.telegram.org/bots/api#passportfile) | _Optional_. Encrypted file with the front side of the document, provided by the user; available only for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). |
| reverse_side | [PassportFile](https://core.telegram.org/bots/api#passportfile) | _Optional_. Encrypted file with the reverse side of the document, provided by the user; available only for “driver_license” and “identity_card”. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). |
| selfie | [PassportFile](https://core.telegram.org/bots/api#passportfile) | _Optional_. Encrypted file with the selfie of the user holding a document, provided by the user; available if requested for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). |
| translation | Array of [PassportFile](https://core.telegram.org/bots/api#passportfile) | _Optional_. Array of encrypted files with translated versions of documents provided by the user; available if requested for “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). |
| hash | String | Base64-encoded element hash for using in [PassportElementErrorUnspecified](https://core.telegram.org/bots/api#passportelementerrorunspecified) |

#### [](https://core.telegram.org/bots/api#encryptedcredentials)EncryptedCredentials

Describes data required for decrypting and authenticating [EncryptedPassportElement](https://core.telegram.org/bots/api#encryptedpassportelement). See the [Telegram Passport Documentation](https://core.telegram.org/passport#receiving-information) for a complete description of the data decryption and authentication processes.

| Field | Type | Description |
| --- | --- | --- |
| data | String | Base64-encoded encrypted JSON-serialized data with unique user's payload, data hashes and secrets required for [EncryptedPassportElement](https://core.telegram.org/bots/api#encryptedpassportelement) decryption and authentication |
| hash | String | Base64-encoded data hash for data authentication |
| secret | String | Base64-encoded secret, encrypted with the bot's public RSA key, required for data decryption |

#### [](https://core.telegram.org/bots/api#setpassportdataerrors)setPassportDataErrors

Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns _True_ on success.

Use this if the data submitted by the user doesn't satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | User identifier |
| errors | Array of [PassportElementError](https://core.telegram.org/bots/api#passportelementerror) | Yes | A JSON-serialized array describing the errors |

#### [](https://core.telegram.org/bots/api#passportelementerror)PassportElementError

This object represents an error in the Telegram Passport element which was submitted that should be resolved by the user. It should be one of:

*   [PassportElementErrorDataField](https://core.telegram.org/bots/api#passportelementerrordatafield)
*   [PassportElementErrorFrontSide](https://core.telegram.org/bots/api#passportelementerrorfrontside)
*   [PassportElementErrorReverseSide](https://core.telegram.org/bots/api#passportelementerrorreverseside)
*   [PassportElementErrorSelfie](https://core.telegram.org/bots/api#passportelementerrorselfie)
*   [PassportElementErrorFile](https://core.telegram.org/bots/api#passportelementerrorfile)
*   [PassportElementErrorFiles](https://core.telegram.org/bots/api#passportelementerrorfiles)
*   [PassportElementErrorTranslationFile](https://core.telegram.org/bots/api#passportelementerrortranslationfile)
*   [PassportElementErrorTranslationFiles](https://core.telegram.org/bots/api#passportelementerrortranslationfiles)
*   [PassportElementErrorUnspecified](https://core.telegram.org/bots/api#passportelementerrorunspecified)

#### [](https://core.telegram.org/bots/api#passportelementerrordatafield)PassportElementErrorDataField

Represents an issue in one of the data fields that was provided by the user. The error is considered resolved when the field's value changes.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Error source, must be _data_ |
| type | String | The section of the user's Telegram Passport which has the error, one of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address” |
| field_name | String | Name of the data field which has the error |
| data_hash | String | Base64-encoded data hash |
| message | String | Error message |

#### [](https://core.telegram.org/bots/api#passportelementerrorfrontside)PassportElementErrorFrontSide

Represents an issue with the front side of a document. The error is considered resolved when the file with the front side of the document changes.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Error source, must be _front\_side_ |
| type | String | The section of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport” |
| file_hash | String | Base64-encoded hash of the file with the front side of the document |
| message | String | Error message |

#### [](https://core.telegram.org/bots/api#passportelementerrorreverseside)PassportElementErrorReverseSide

Represents an issue with the reverse side of a document. The error is considered resolved when the file with reverse side of the document changes.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Error source, must be _reverse\_side_ |
| type | String | The section of the user's Telegram Passport which has the issue, one of “driver_license”, “identity_card” |
| file_hash | String | Base64-encoded hash of the file with the reverse side of the document |
| message | String | Error message |

#### [](https://core.telegram.org/bots/api#passportelementerrorselfie)PassportElementErrorSelfie

Represents an issue with the selfie with a document. The error is considered resolved when the file with the selfie changes.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Error source, must be _selfie_ |
| type | String | The section of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport” |
| file_hash | String | Base64-encoded hash of the file with the selfie |
| message | String | Error message |

#### [](https://core.telegram.org/bots/api#passportelementerrorfile)PassportElementErrorFile

Represents an issue with a document scan. The error is considered resolved when the file with the document scan changes.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Error source, must be _file_ |
| type | String | The section of the user's Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” |
| file_hash | String | Base64-encoded file hash |
| message | String | Error message |

#### [](https://core.telegram.org/bots/api#passportelementerrorfiles)PassportElementErrorFiles

Represents an issue with a list of scans. The error is considered resolved when the list of files containing the scans changes.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Error source, must be _files_ |
| type | String | The section of the user's Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” |
| file_hashes | Array of String | List of base64-encoded file hashes |
| message | String | Error message |

#### [](https://core.telegram.org/bots/api#passportelementerrortranslationfile)PassportElementErrorTranslationFile

Represents an issue with one of the files that constitute the translation of a document. The error is considered resolved when the file changes.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Error source, must be _translation\_file_ |
| type | String | Type of element of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” |
| file_hash | String | Base64-encoded file hash |
| message | String | Error message |

#### [](https://core.telegram.org/bots/api#passportelementerrortranslationfiles)PassportElementErrorTranslationFiles

Represents an issue with the translated version of a document. The error is considered resolved when a file with the document translation change.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Error source, must be _translation\_files_ |
| type | String | Type of element of the user's Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” |
| file_hashes | Array of String | List of base64-encoded file hashes |
| message | String | Error message |

#### [](https://core.telegram.org/bots/api#passportelementerrorunspecified)PassportElementErrorUnspecified

Represents an issue in an unspecified place. The error is considered resolved when new data is added.

| Field | Type | Description |
| --- | --- | --- |
| source | String | Error source, must be _unspecified_ |
| type | String | Type of element of the user's Telegram Passport which has the issue |
| element_hash | String | Base64-encoded element hash |
| message | String | Error message |

### [](https://core.telegram.org/bots/api#games)Games

Your bot can offer users **HTML5 games** to play solo or to compete against each other in groups and one-on-one chats. Create games via [@BotFather](https://t.me/botfather) using the _/newgame_ command. Please note that this kind of power requires responsibility: you will need to accept the terms for each game that your bots will be offering.

*   Games are a new type of content on Telegram, represented by the [Game](https://core.telegram.org/bots/api#game) and [InlineQueryResultGame](https://core.telegram.org/bots/api#inlinequeryresultgame) objects.
*   Once you've created a game via [BotFather](https://t.me/botfather), you can send games to chats as regular messages using the [sendGame](https://core.telegram.org/bots/api#sendgame) method, or use [inline mode](https://core.telegram.org/bots/api#inline-mode) with [InlineQueryResultGame](https://core.telegram.org/bots/api#inlinequeryresultgame).
*   If you send the game message without any buttons, it will automatically have a 'Play _GameName_' button. When this button is pressed, your bot gets a [CallbackQuery](https://core.telegram.org/bots/api#callbackquery) with the _game\_short\_name_ of the requested game. You provide the correct URL for this particular user and the app opens the game in the in-app browser.
*   You can manually add multiple buttons to your game message. Please note that the first button in the first row **must always** launch the game, using the field _callback\_game_ in [InlineKeyboardButton](https://core.telegram.org/bots/api#inlinekeyboardbutton). You can add extra buttons according to taste: e.g., for a description of the rules, or to open the game's official community.
*   To make your game more attractive, you can upload a GIF animation that demonstrates the game to the users via [BotFather](https://t.me/botfather) (see [Lumberjack](https://t.me/gamebot?game=lumberjack) for example).
*   A game message will also display high scores for the current chat. Use [setGameScore](https://core.telegram.org/bots/api#setgamescore) to post high scores to the chat with the game, add the _disable\_edit\_message_ parameter to disable automatic update of the message with the current scoreboard.
*   Use [getGameHighScores](https://core.telegram.org/bots/api#getgamehighscores) to get data for in-game high score tables.
*   You can also add an extra [sharing button](https://core.telegram.org/bots/games#sharing-your-game-to-telegram-chats) for users to share their best score to different chats.
*   For examples of what can be done using this new stuff, check the [@gamebot](https://t.me/gamebot) and [@gamee](https://t.me/gamee) bots.

#### [](https://core.telegram.org/bots/api#sendgame)sendGame

Use this method to send a game. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| business_connection_id | String | Optional | Unique identifier of the business connection on behalf of which the message will be sent |
| chat_id | Integer | Yes | Unique identifier for the target chat. Games can't be sent to channel direct messages chats and channel chats. |
| message_thread_id | Integer | Optional | Unique identifier for the target message thread (topic) of the forum; for forum supergroups only |
| game_short_name | String | Yes | Short name of the game, serves as the unique identifier for the game. Set up your games via [@BotFather](https://t.me/botfather). |
| disable_notification | Boolean | Optional | Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. |
| protect_content | Boolean | Optional | Protects the contents of the sent message from forwarding and saving |
| allow_paid_broadcast | Boolean | Optional | Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance |
| message_effect_id | String | Optional | Unique identifier of the message effect to be added to the message; for private chats only |
| reply_parameters | [ReplyParameters](https://core.telegram.org/bots/api#replyparameters) | Optional | Description of the message to reply to |
| reply_markup | [InlineKeyboardMarkup](https://core.telegram.org/bots/api#inlinekeyboardmarkup) | Optional | A JSON-serialized object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game. |

#### [](https://core.telegram.org/bots/api#game)Game

This object represents a game. Use BotFather to create and edit games, their short names will act as unique identifiers.

| Field | Type | Description |
| --- | --- | --- |
| title | String | Title of the game |
| description | String | Description of the game |
| photo | Array of [PhotoSize](https://core.telegram.org/bots/api#photosize) | Photo that will be displayed in the game message in chats. |
| text | String | _Optional_. Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls [setGameScore](https://core.telegram.org/bots/api#setgamescore), or manually edited using [editMessageText](https://core.telegram.org/bots/api#editmessagetext). 0-4096 characters. |
| text_entities | Array of [MessageEntity](https://core.telegram.org/bots/api#messageentity) | _Optional_. Special entities that appear in _text_, such as usernames, URLs, bot commands, etc. |
| animation | [Animation](https://core.telegram.org/bots/api#animation) | _Optional_. Animation that will be displayed in the game message in chats. Upload via [BotFather](https://t.me/botfather) |

#### [](https://core.telegram.org/bots/api#callbackgame)CallbackGame

A placeholder, currently holds no information. Use [BotFather](https://t.me/botfather) to set up your game.

#### [](https://core.telegram.org/bots/api#setgamescore)setGameScore

Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the [Message](https://core.telegram.org/bots/api#message) is returned, otherwise _True_ is returned. Returns an error, if the new score is not greater than the user's current score in the chat and _force_ is _False_.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | User identifier |
| score | Integer | Yes | New score, must be non-negative |
| force | Boolean | Optional | Pass _True_ if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters |
| disable_edit_message | Boolean | Optional | Pass _True_ if the game message should not be automatically edited to include the current scoreboard |
| chat_id | Integer | Optional | Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat |
| message_id | Integer | Optional | Required if _inline\_message\_id_ is not specified. Identifier of the sent message |
| inline_message_id | String | Optional | Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message |

#### [](https://core.telegram.org/bots/api#getgamehighscores)getGameHighScores

Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. Returns an Array of [GameHighScore](https://core.telegram.org/bots/api#gamehighscore) objects.

> This method will currently return scores for the target user, plus two of their closest neighbors on each side. Will also return the top three users if the user and their neighbors are not among them. Please note that this behavior is subject to change.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| user_id | Integer | Yes | Target user id |
| chat_id | Integer | Optional | Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat |
| message_id | Integer | Optional | Required if _inline\_message\_id_ is not specified. Identifier of the sent message |
| inline_message_id | String | Optional | Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message |

#### [](https://core.telegram.org/bots/api#gamehighscore)GameHighScore

This object represents one row of the high scores table for a game.

| Field | Type | Description |
| --- | --- | --- |
| position | Integer | Position in high score table for the game |
| user | [User](https://core.telegram.org/bots/api#user) | User |
| score | Integer | Score |

* * *

And that's about all we've got for now.

If you've got any questions, please check out our [**Bot FAQ »**](https://core.telegram.org/bots/faq)