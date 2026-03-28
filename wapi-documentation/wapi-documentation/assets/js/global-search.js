(function () {
  "use strict";

  // Embedded search index with content from all documentation pages
  const SEARCH_INDEX = [
    {
      url: "index.html",
      title: "Introduction",
      content:
        "Wapi Social Messaging Real-Time Communication Platform. Wapi is a social communication platform built for fast expressive secure conversations. Powered by React Node.js Socket.io WebRTC brings real-time chat social features media sharing smooth audio video calls into one simple experience. Whether messaging friends sharing moments chatting groups Wapi offers clean responsive interface works effortlessly across all devices. Social messaging platform real-time communication instant messaging direct messages group chats voice notes file sharing high-quality audio video calls. Built React frontend Node.js backend Socket.io WebRTC technologies. Social features friend requests profiles online presence temporary status stories. Real-time messaging instant delivery typing indicators read receipts online offline status message threading reply forward support text emoji media. Group conversations create manage group chats organized multi-user interface. Media file sharing upload images documents videos preview images videos share files groups direct messages download shared files file size limits. Voice video calls one-on-one voice calls one-on-one video calls group calls screen sharing call history mute unmute toggle video call notifications WebRTC integration. Notifications real-time push notifications email notifications desktop notifications mobile notifications notification settings mute groups do not disturb mode. Personalization security custom themes wallpapers user settings OTP verification secure sessions. Stories media sharing create stories share photos short videos auto-expire story viewers list privacy controls public private close-friends only quick reactions send emojis stories instantly media compression auto-optimize story uploads. Social profile user identity profile customization name bio avatar status username search find users effortlessly last seen online status real-time activity indicators social links add personal links handles profile privacy control who sees what contact sync easily find friends across devices",
    },
    {
      url: "prerequisite.html",
      title: "Prerequisite",
      content:
        "Prerequisites Before You Begin Before installing Wapi make sure your system meets the following requirements Frontend Requirements Node.js version 18 or higher npm or yarn package manager Modern web browser Chrome Firefox Safari Edge Backend Requirements Node.js version 18 or higher MongoDB database version 5 or higher npm package manager Port availability 3000 for backend server Database Requirements MongoDB installed and running MongoDB connection string Database user with read write permissions Development Tools Git for version control Text editor or IDE VS Code recommended Terminal or command line access Optional Requirements Redis for caching and sessions SMTP server for email notifications SSL certificates for production AWS S3 or similar for file storage System Requirements minimum specifications hardware software compatibility operating system Windows macOS Linux server requirements cloud hosting considerations network requirements bandwidth considerations security requirements firewall configurations SSL TLS certificates domain name configuration DNS settings",
    },
    {
      url: "overview.html",
      title: "Overview",
      content:
        "Wapi Installation Overview This guide provides comprehensive overview installing Wapi both frontend backend components. Wapi consists three primary parts wapi-api wapi-frontend wapi-admin. You need run each part separately specific order. Installation Steps Step 1 Prerequisites Verify Node.js installation Check MongoDB connection Ensure required ports available Step 2 Download Download Wapi package from CodeCanyon Extract ZIP file You will find three main folders wapi-api wapi-frontend wapi-admin Step 3 Frontend Installation Navigate wapi-frontend folder Install dependencies using npm install Configure environment variables .env file Start development server with npm run dev Build production using npm run build Step 4 Backend Installation Navigate wapi-backend folder Install dependencies using npm install Configure environment variables .env file Set up MongoDB connection Start server with npm start Or use nodemon for development Step 5 Admin Panel Installation Navigate wapi-admin folder Install dependencies using npm install Configure environment variables .env file Start development server Step 6 Database Setup Create MongoDB database Configure connection string Run database migrations if needed Seed initial data if required Step 7 Testing Test frontend at localhost 5173 Test backend API at localhost 3000 Test admin panel Verify Socket.IO connection Test file upload functionality Check WebRTC audio video calls Project Structure understanding folder organization configuration files environment variables setup process troubleshooting common installation issues",
    },
    {
      url: "frontend-installation.html",
      title: "Frontend Installation",
      content:
        "Wapi Frontend Installation This section explains how set up run Wapi frontend built with React Vite. Frontend connects with backend API provide chat social features real-time communication. Step 1 Download Extract After purchasing Wapi download ZIP file from CodeCanyon Extract ZIP you will find wapi-frontend folder. unzip wapi-frontend.zip cd wapi-frontend This folder contains complete React Vite project including all components pages configuration files. Step 2 Environment Configuration Create .env file root wapi-frontend folder. This file contains all environment-specific configuration required connecting backend API Socket.IO storage. VITE_API_BASE_URL https your-domain.com api VITE_SOCKET_URL ws your-domain.com VITE_STORAGE_URL https your-domain.com storage VITE_STORAGE_SECRET_KEY your_secret_key VITE_API_BASE_URL Base URL Wapi backend API VITE_SOCKET_URL URL Socket.IO server real-time messaging presence updates VITE_STORAGE_URL URL storage file uploads VITE_STORAGE_SECRET_KEY Secret key used encrypting storage data Update these URLs depending whether running application locally production server. Step 3 Install Dependencies Install all required packages React Vite frontend npm install This install all dependencies including React Vite Socket.IO client WebRTC libraries other required packages. Step 4 Start Frontend For development npm run dev Frontend start development mode access browser URL shown terminal usually http localhost 5173. For production build npm run build This generate production-ready build dist folder served via any web server. Preview production build locally npm run preview Troubleshooting common issues dependency conflicts port already use environment variable errors build errors production optimization",
    },
    {
      url: "backend-installation.html",
      title: "Backend Installation",
      content:
        "Backend Installation Guide Step 1 Download Extract Download Wapi package from CodeCanyon Extract files Locate wapi-backend folder cd wapi-backend Step 2 Install Dependencies Install all required Node.js packages npm install This installs Express MongoDB driver Socket.IO JWT authentication WebRTC dependencies all other required packages Step 3 Environment Configuration Create .env file backend root folder Configure following variables PORT 3000 MONGODB_URI mongodb localhost 27017 wapi JWT_SECRET your_jwt_secret_key SOCKET_PORT 3000 AWS_ACCESS_KEY_ID your_aws_key AWS_SECRET_ACCESS_KEY your_aws_secret AWS_S3_BUCKET_NAME your_bucket_name SMTP_HOST smtp.gmail.com SMTP_PORT 587 SMTP_USER your_email SMTP_PASS your_password Configuration Explanation PORT Server port number default 3000 MONGODB_URI MongoDB connection string JWT_SECRET Secret key JWT token generation SOCKET_PORT Port Socket.IO server AWS credentials file uploads S3 SMTP settings sending emails Step 4 Database Setup Ensure MongoDB running Start MongoDB service mongod Create database application create automatically Run migrations any npm run migrate Seed initial data optional npm run seed Step 5 Start Backend For development auto-reload npm run dev Or nodemon nodemon server.js For production npm start Backend server start configured port default 3000. Step 6 Verify Installation Check server health GET http localhost 3000 health Test API endpoint GET http localhost 3000 api Check Socket.IO connection Test using Socket.IO client Review server logs errors API endpoints authentication middleware database connections file upload configuration WebRTC signaling server setup",
    },
    {
      url: "cpanel.html",
      title: "C-panel Deployment",
      content:
        "Deploying Wapi cPanel Prerequisites cPanel Hosting Ensure hosting plan supports Node.js sufficient resources FTP Access Obtain FTP credentials file uploads Domain Configuration Verify domain correctly pointed cPanel account Frontend Deployment React Vite Step 1 Configure Vite Production export default defineConfig base https yourdomain.com Step 2 Build Application npm install npm run build Step 3 Upload cPanel Log cPanel navigate File Manager Go public_html directory subdirectory subdomain Click Upload select dist.zip file Extract uploaded zip file Step 4 Configure .htaccess SPA Routing IfModule mod_rewrite.c RewriteEngine On RewriteBase RewriteRule index.html L RewriteCond REQUEST_FILENAME f RewriteCond REQUEST_FILENAME d RewriteCond REQUEST_FILENAME l RewriteRule index.html L IfModule We dont recommend deploying Wapi backend cPanel because doesnt provide flexibility runtime control needed manage background services real-time functionalities effectively cPanel limitations Node.js applications alternative hosting solutions production deployment considerations",
    },
    {
      url: "virtual-server.html",
      title: "Virtual Private Server",
      content:
        "Virtual Private Server Deployment Deploy Wapi VPS Ubuntu Prerequisites VPS Ubuntu 20.04 higher Root sudo access Domain name pointed VPS IP Minimum 2GB RAM 2 CPU cores Step 1 Server Setup Update system packages sudo apt update sudo apt upgrade Install Node.js sudo apt install nodejs npm Install MongoDB sudo apt install mongodb Install Nginx sudo apt install nginx Install PM2 process management sudo npm install -g pm2 Step 2 Upload Application Files Use SCP FTP upload files scp -r wapi-frontend user server-ip home user scp -r wapi-backend user server-ip home user Or use Git clone git clone your-repo-url Step 3 Backend Deployment Navigate backend folder cd wapi-backend Install dependencies npm install Configure environment variables nano .env Set production values Start PM2 pm2 start server.js name wapi-backend Save PM2 configuration pm2 save pm2 startup Step 4 Frontend Deployment Navigate frontend folder cd wapi-frontend Install dependencies npm install Build production npm run build Move build files web root sudo mv dist var www wapi Step 5 Nginx Configuration Create Nginx config sudo nano etc nginx sites-available wapi Server configuration server listen 80 server_name yourdomain.com location proxy_pass http localhost 3000 proxy_http_version 1.1 proxy_set_header Upgrade http_upgrade proxy_set_header Connection upgrade proxy_set_header Host host location root var www wapi try_files uri uri index.html Enable site sudo ln -s etc nginx sites-available wapi etc nginx sites-enabled Test configuration sudo nginx -t Reload Nginx sudo systemctl reload nginx Step 6 SSL Certificate Install Certbot sudo apt install certbot python3-certbot-nginx Obtain certificate sudo certbot --nginx -d yourdomain.com Step 7 Firewall Configuration sudo ufw allow OpenSSH sudo ufw allow Nginx Full sudo ufw enable Server maintenance monitoring performance optimization security hardening backup strategies",
    },
    {
      url: "vercel.html",
      title: "Vercel Deployment",
      content:
        "Deploy Frontend Vercel Vercel perfect deploying Wapi React frontend Prerequisites Vercel account free paid GitHub repository frontend code Vercel CLI optional Step 1 Prepare Frontend Ensure code Git repository Push GitHub GitLab Bitbucket Verify .env variables set correctly Create vercel.json configuration Step 2 Deploy via Vercel Dashboard Go vercel.com sign Click New Project Import Git repository Select frontend repository Configure project Build Command npm run build Output Directory dist Install Command npm install Root Directory leave blank specify subdirectory Step 3 Environment Variables Add environment variables Vercel dashboard VITE_API_BASE_URL backend API URL VITE_SOCKET_URL socket server URL VITE_STORAGE_URL storage URL Step 4 Deploy Click Deploy button Wait build complete Get deployment URL yourdomain.vercel.app Step 5 Custom Domain Optional Add custom domain project settings Update DNS records Point domain Vercel Wait SSL certificate Vercel Configuration File Create vercel.json project root builds src package.json use vercel node routes src catch dest index.html Backend Deployment Note Vercel primarily frontend. Backend deploy Railway Render Heroku Alternative use Vercel Serverless Functions API Step 6 Continuous Deployment Every push main branch triggers auto-deployment Preview deployments pull requests Rollback previous deployments anytime Vercel features edge functions CDN optimization performance monitoring analytics",
    },
    {
      url: "core-features.html",
      title: "Core Features",
      content:
        "Core Features Wapi Authentication Profile Setup Smooth secure onboarding every user Email-based Authentication Ensure valid trusted user accounts OTP Verification Add instant secure identity confirmation Password Recovery Reset forgotten passwords easily Quick Profile Setup Set profile picture name basic preferences Multi-Profile Essentials Designed support future workspace-based accounts Real-time Chat System Fast expressive messaging built everyday conversations 1:1 Private Chat Direct conversations anytime Group Chat Create small large conversation groups Rich Messaging Text emojis mentions media File Sharing Media Multi-format Sharing Share images videos documents audio File Gallery View shared files neatly sorted type Media Preview Check images videos without leaving chat File Size Limits Control max file sizes per user Stories Media Sharing Social way share life moments friends followers Create Stories Share photos short videos auto-expire Story Viewers List See viewed story Privacy Controls Make stories public private close-friends only Quick Reactions Send emojis stories instantly Media Compression Auto-optimize story uploads Audio Video Calling WebRTC High-quality calls designed smooth stable communication HD Voice Video Clear call quality across devices Mute Unmute Camera Controls Simple call controls Call Status Indicators Connection network insights Peer-to-Peer Communication Low-latency WebRTC streaming Multi-User Call Support Connect multiple participants Notifications Smart alerts keep users informed without overwhelming Message Alerts Get notified chats mentions Call Notifications Incoming call popups accept decline Story Notifications Alerts new stories friends Custom Notification Settings Enable disable specific alerts Read Indicators Quickly know already seen new",
    },
    {
      url: "advanced-features.html",
      title: "Advanced Features",
      content:
        "Advanced Features Audio Video Calling Suite Stay connected high-quality real-time communication WebRTC Integration Make crystal-clear browser video audio calls Group Calls Add multiple participants stable connections Call Controls Toggle camera mute switch devices Ring Call Status Incoming alerts busy indicators call states Network Handling Automatic quality adjustments low bandwidth Social Profile User Identity Create meaningful connections rich personal profiles Profile Customization Name bio avatar status Username Search Find users effortlessly Last Seen Online Status Real-time activity indicators Social Links Add personal links handles Profile Privacy Control sees what Contact Sync Easily find friends across devices Advanced Messaging Tools Powerful chat experience built fast expressive communication Message Reactions Emoji responses messages Mentions Tagging Highlight users groups Voice Notes Record send audio clips instantly Forwarding Replying Keep conversations organized Chat Filters Sort media files links unread Dynamic Chat Loading Seamless infinite scroll Stories Moments Share daily life quick engaging updates Photo Video Stories Temporary posts disappear automatically Viewers List See viewed story Reaction Replies One-tap emoji reactions Privacy Controls Public private close-friends lists Auto Compression Optimizes media quick uploads Story Highlights Save important stories permanently Group Management Controls Build manage communities flexible settings Group Creation Public private invite-only groups Role Assignments Admin moderator member roles Join Requests Approve deny new members Group Announcements Pinned posts broadcast messages Admin Tools Remove mute restrict members Group Media Hub View files shared inside group Media File Handling Smooth sharing experience types content Large File Uploads Supports photos videos audio documents Media Preview Inline previews without downloading Auto Compression Optimize large videos photos Chat File Gallery See shared media view File Type Controls Manage supported formats Notifications Activity Alerts Stay informed without interruptions Message Alerts Fast reliable delivery Call Alerts Incoming call popups Story Notifications See new stories posted Unread Counter Track messages across chats Custom Notification Options Per-chat settings Sound Badge Popup Controls Configure alert styles Privacy Security Controls Protect conversations powerful privacy tools End-to-End Safe Structure Strong encryption messages Two-Step Verification Secure login OTP Session Management Track revoke active devices Block Report System Handle unwanted interactions Media Visibility Controls Hide restrict media access Account Protection Settings Password recovery mail backup codes Explore Social Discovery Connect discover grow social circle User Discovery Explore trending suggested profiles Friend Requests Add accept connections Search Filters Find people name interest Recommended Users Smart suggestions based interactions Trending Stories See popular within network Social Feed Expansion Future-ready design upcoming social modules",
    },
    {
      url: "socket-io.html",
      title: "Socket IO",
      content:
        "Socket.IO Integration Real-Time Communication Socket.IO Setup Backend Configuration Install Socket.IO npm install socket.io Initialize Socket.IO server const io require socket.io http io.on connection socket console.log user connected Handle events socket.on disconnect console.log user disconnected Frontend Configuration Install Socket.IO client npm install socket.io-client Connect to server import io from socket.io-client const socket io http localhost 3000 Real-Time Events Message Events Send message socket.emit send message data Receive message socket.on new message data console.log data Typing Events User typing socket.emit typing username socket.on user typing user console.log user is typing Presence Events User online socket.emit user online socket.on user status data Update user status Group Events Join Group socket.emit join group groupId Leave group socket.emit leave group groupId Group message socket.on group message data Handle message Call Events Initiate call socket.emit call user data Answer call socket.emit answer call data End call socket.emit end call callId Socket.IO Namespaces Chat namespace const chatSocket io localhost 3000 chat Notification namespace const notifSocket io localhost 3000 notifications Error Handling socket.on connect error err console.error Connection error err socket.on error err console.error Socket error err Reconnection socket.io reconnection true reconnectionAttempts 5 reconnectionDelay 1000 Room Management Join room socket.join roomId Leave room socket.leave roomId Broadcast to room io.to roomId emit event data",
    },
    {
      url: "webrtc.html",
      title: "WebRTC",
      content:
        "WebRTC Integration Audio and Video Calls WebRTC Setup Install Dependencies npm install simple-peer npm install socket.io-client Basic WebRTC Configuration const peer new SimplePeer initiator true trickle false stream localStream peer.on signal data socket.emit signal data peer.on stream remoteStream remoteVideo.srcObject remoteStream Audio Call Implementation Get user media navigator.mediaDevices.getUserMedia audio true video false then stream localStream stream peer.addStream stream catch err console.error err Video Call Implementation navigator.mediaDevices.getUserMedia audio true video true then stream localStream stream localVideo.srcObject stream peer.addStream stream catch err console.error err Screen Sharing navigator.mediaDevices.getDisplayMedia video true then stream screenStream stream peer.replaceTrack stream.getVideoTracks 0 catch err console.error err Peer Connection Handle incoming signal socket.on signal data peer.signal data Handle connection peer.on connect console.log Connected to peer Handle error peer.on error err console.error Peer error err Call Controls Mute Audio localStream.getAudioTracks forEach track track.enabled false Toggle Video localStream.getVideoTracks forEach track track.enabled false End Call peer.destroy localStream.getTracks forEach track track.stop WebRTC Configuration ICE Servers const configuration iceServers urls stun stun.l.google.com 19302 urls turn turn.example.com 3478 username user credential pass",
    },
    {
      url: "super-dashboard.html",
      title: "Super Admin Dashboard Module",
      content:
        "Super Admin Dashboard Module Wapi Super Admin comprehensive super admin dashboard designed manage monitor Wapi platform administrative interface provides powerful tools oversee users groups content system configurations platform offers real-time insights analytics centralized control aspects Wapi ecosystem core platform administration Wapi Super Admin leverages integrated Dashboard User Management Page Management FAQ Management Chat Wallpaper Management Sticker Management Communication Module System Settings modules deliver end-to-end control real-time insights across entire Wapi ecosystem Dashboard Module Dashboard acts control center super administrators offering real-time overview Wapi performance highlights key platform statistics growth trends engagement insights support data-driven decisions Statistical Widgets Four KPI cards top summarize platform health Total Members tracks total users growth rate Total Groups shows total groups creation trends Online Users displays active users real time Files Shared measures collaboration activity New Groups This Week visual chart showing group creations current week track adoption trends Most Active Users list top-engaged users messages sent activity level helping identify key contributors Location-Wise Users chart showing user distribution across regions understand adoption geography User Growth Chart line chart illustrating monthly user registrations growth patterns over time Recent Groups table newly created groups details name creation date creator member count Group Growth Chart bar chart comparing monthly group creation trends measure platform expansion Message Activity Chart Hour-by-hour usage visualization catch dips spikes chat traffic Message Distribution Shows mix texts media calls track feature adoption Recent User Registrations Live feed new accounts rapid verification escalation Report Types Displays most common abuse categories guide policy tooling updates Monthly User Growth Month-over-month chart acquisition retention tracking Today Hourly Activity Fine-grained timeline confirming uptime throughput throughout day Use Cases Detect traffic anomalies before impact SLAs Validate marketing onboarding campaigns real time Plan moderation staffing based report distribution Prioritize localization support fast-growing regions Pull executive-ready KPIs without manual data exports",
    },
    {
      url: "super-user.html",
      title: "Super Admin User Management Module",
      content:
        "User Management Module User management table displays registered users details name email associated groups current status User Status Management Admin toggle user status using switch button user deactivated status changes immediately user loses access platform success notification appears confirming status update Edit User Details Admin click manage edit button modify first name last name phone number country code profile avatar upload edit remove email view-only cannot edited updating changes saved reflected immediately user list Delete User Admin clicks delete confirmation required upon confirmation user permanently deleted system loses access removed table bulk delete option available multiple users Key Points Actions activate deactivate edit delete show instant feedback toast notifications deleted users permanently removed system email addresses cannot modified account creation status changes take effect immediately User search filtering pagination user activity tracking user reports moderation tools user analytics user engagement metrics",
    },
    {
      url: "super-pages.html",
      title: "Super Admin Page Management Module",
      content:
        "Page Management Module Page List View pages table displays content pages title slug URL identifier status toggle creation date action buttons edit delete Add Edit Page Admin click add page edit manage title 3-200 characters page type terms privacy policy other slug auto-generated predefined types manual other content rich text editor formatting options status active inactive toggle saving page created updated appears list Toggle Page Status Admin activate deactivate pages using status toggle active pages accessible users inactive ones hidden status changes take effect immediately Delete Page Admin clicks delete upon confirmation page permanently deleted removed table bulk delete available multiple pages Key Points Changes apply platform-wide immediately saving supports PNG JPG SVG formats logos images SMTP configuration required email functionality settings organized tabs general email configuration Page content management SEO settings meta tags page templates custom page types content versioning page preview page publishing workflow",
    },
    {
      url: "super-faq.html",
      title: "Super Admin FAQ Management Module",
      content:
        "FAQ Management Module FAQs List View FAQs table displays questions question text answer preview truncated status toggle creation date action buttons edit delete Add Edit FAQ Admin click add FAQ edit manage question 10-500 characters answer 10-2000 characters status active inactive toggle saving FAQ created updated appears list Toggle FAQ Status Admin activate deactivate FAQs using status toggle active FAQs visible users inactive ones hidden status changes take effect immediately Delete FAQ Admin clicks delete upon confirmation FAQ permanently deleted removed table bulk delete available multiple FAQs FAQ Status Priority Controls Each entry exposes status badge Draft Published Archived priority chip Tapping badge opens confirmation modal outlining visibility change adjusting priority reorders FAQ within category immediately reflects front-end Bulk updates available multiple rows selected Preview Drawer Clicking anywhere row opens preview drawer showing full answer text tags linked pages admins verify context before updating Bulk Actions Filters Multi-select checkboxes make easy change status category priority multiple FAQs once Filters above table let admins narrow category keyword status tag ensuring quick navigation large knowledge bases Key Points Every status change publish delete requires explicit confirmation surfaces toast notification Draft FAQs remain invisible until published previewed via row drawer Priority chips determine ordering public FAQ page update immediately Preview drawer provides fast QA without leaving list view Bulk actions respect selected rows summarize changes before execution FAQ categories tags search functionality FAQ analytics view counts",
    },
    {
      url: "super-wallpaper.html",
      title: "Super Admin Chat Wallpaper Module",
      content:
        "Chat Wallpapers Module Wallpaper Catalog View Chat Wallpapers table catalogs every wallpaper asset columns thumbnail preview title category resolution status quick actions Clicking row outside action icons brings preview drawer showing full image supported themes light dark device-specific notes admins validate visual quality before changes Status Visibility Controls Each entry includes status badge Draft Live Archived Selecting opens confirmation modal clarifies whether wallpaper appear end-user picker Bulk toggles become available multiple wallpapers selected making seasonal rollouts faster Add Edit Wallpaper Add Wallpaper button Edit icon each row open wallpaper form Admins upload images specify recommended resolutions assign categories Abstract Scenic flag availability light dark themes Saving publishes immediately stores draft depending chosen status Duplicate Wallpaper Duplicate action clones wallpaper metadata new draft entry letting admins tweak color variants rename sets without re-uploading scratch Duplicated item inherits tags gets copy suffix until edited Delete Archive Wallpaper Choosing Delete launches confirmation dialog explaining whether asset archived hidden recoverable permanently removed Confirmed deletions remove wallpaper user selection instantly surface toast notification Admins perform bulk deletes multi-select checkboxes Key Points Preview drawer helps QA visual fidelity theme compatibility without leaving list Every publish archive delete action requires confirmation produces toast Draft wallpapers stay hidden users until explicitly published Bulk actions accelerate seasonal refreshes cleanups Metadata resolution category theme availability updates immediately catalog once saved Wallpaper categories themes customization options wallpaper upload guidelines image optimization",
    },
    {
      url: "super-sticker.html",
      title: "Super Admin Stickers Module",
      content:
        "Stickers Management Module Sticker Pack List View Stickers table lists every sticker pack columns pack thumbnail name total stickers category status quick actions Selecting row outside action icons opens drawer displays stickers pack order availability free premium admins review content before making edits Status Availability Controls Each pack status badge Draft Live Archived optional monetization tag Clicking badge opens confirmation modal explaining whether pack appear end-user sticker picker Bulk status changes enabled multiple packs selected simplifying seasonal launches Add Edit Sticker Pack Add Sticker Pack button Edit icon route Stickers Form Super Admins upload individual sticker files set pack metadata name category description define ordering choose premium free availability Saving publishes keeps draft based selected status Manage Individual Stickers Within edit view drawer admins reorder stickers drag-and-drop replace artwork flag specific stickers removal Each change auto-saves position updates pack preview instantly Duplicate Pack Duplicate action clones entire pack including metadata sticker assets new draft admins experiment variations recolors language-specific text without rebuilding scratch Delete Archive Pack Deleting pack triggers guarded dialog clarifies whether archived hidden recoverable permanently removed Confirmations required toast notification confirms completion Bulk delete works multi-select checkboxes rapid cleanup Key Points Preview drawers let admins inspect every sticker before editing publishing All publish archive delete actions require confirmation emit toast notifications Draft packs hidden users until explicitly set Live Duplicate accelerates variant creation without re-uploading assets Metadata ordering changes reflected immediately table once saved Sticker categories premium free stickers sticker pack management bulk operations",
    },
    {
      url: "super-communication.html",
      title: "Super Admin Communication Module",
      content:
        "Communication Management Module Contact Inquiries List View Contact Inquiries table captures every message submitted through Wapis public contact forms showing requester name email subject priority status received date Clicking row opens drawer full message body attachments interaction history Super Admins respond escalate without leaving list Contact Inquiry Actions Assign Drop-down route inquiry specific admin team assignment updates instantly logs change Respond Opens reply panel admins send templated freeform responses sent messages log conversation thread Resolve Reopen Status buttons trigger confirmation modal once confirmed move inquiry appropriate queue toast feedback Bulk status updates supported triaging multiple tickets once Email Configuration View Dedicated settings page presented form showing SMTP host port username password masked support from addresses display names Fields pre-populated current settings fetched via API admins see latest configuration Update Email Settings Admins edit SMTP credentials mail-from names support address click Save submit Changes trigger validation success display toast confirming updated configuration Form prevents accidental submission requiring confirmation sensitive fields password host change Key Points Contact inquiry actions assign respond resolve require confirmation log activity auditing Every email configuration change validated persists via settings API toaster feedback Inquiry drawers expose full context message attachments history responses informed Bulk actions inquiry table help process high volumes quickly Sensitive email settings password masked default updated explicitly changed Email templates response management contact form configuration",
    },
    {
      url: "super-setting.html",
      title: "Super Admin Settings Module",
      content:
        "Settings Module Settings Overview settings module organized two tabs general email configuration admin configure application-wide settings affect entire platform General Settings Tab Admin configure general settings branding logos light logo light theme dark logo dark theme favicon browser tab icon sidebar logo contact information app name support email contact email contact phone company address error pages configuration no internet title content no internet image 404 page title content 404 page image Updating settings changes saved applied immediately across platform success notification confirms update Email Configuration Tab Admin configure SMTP email settings sending system emails SMTP user email account username SMTP password email account password SMTP port mail server port 587 465 SMTP host mail server hostname smtp.gmail.com mail from name sender name displayed emails mail from email sender email address Updating email settings system uses credentials outgoing emails OTP notifications success notification confirms configuration update Key Points Settings changes take effect immediately saving logo image uploads support common formats PNG JPG SVG SMTP credentials required email functionality OTP password reset notifications changes apply platform-wide affect users success notification appears successful update Platform branding customization theme settings application configuration system preferences security settings backup configuration",
    },
    {
      url: "socket-io.html",
      title: "Socket IO",
      content:
        "Socket.IO Integration Real-Time Communication Socket.IO Setup Backend Configuration Install Socket.IO npm install socket.io Initialize Socket.IO server const io require socket.io http io.on connection socket console.log user connected Handle events socket.on disconnect console.log user disconnected Frontend Configuration Install Socket.IO client npm install socket.io-client Connect server import io from socket.io-client const socket io http localhost 3000 Real-Time Events Message Events Send message socket.emit send message data Receive message socket.on new message data console.log data Typing Events User typing socket.emit typing username socket.on user typing user console.log user typing Presence Events User online socket.emit user online socket.on user status data Update user status Group Events Join group socket.emit join group groupId Leave group socket.emit leave group groupId Group message socket.on group message data Handle message Call Events Initiate call socket.emit call user data Answer call socket.emit answer call data End call socket.emit end call callId Story Events Story created socket.emit story created data Story viewed socket.emit story viewed storyId userId Socket.IO Namespaces Chat namespace const chatSocket io localhost 3000 chat Notification namespace const notifSocket io localhost 3000 notifications Error Handling socket.on connect error err console.error Connection error err socket.on error err console.error Socket error err Reconnection socket.io reconnection true reconnectionAttempts 5 reconnectionDelay 1000 Room Management Join room socket.join roomId Leave room socket.leave roomId Broadcast room io.to roomId emit event data Real-time messaging presence updates typing indicators online status notifications",
    },
    {
      url: "webrtc.html",
      title: "WebRTC",
      content:
        "WebRTC Integration Audio Video Calls WebRTC Setup Install Dependencies npm install simple-peer npm install socket.io-client Basic WebRTC Configuration const peer new SimplePeer initiator true trickle false stream localStream peer.on signal data socket.emit signal data peer.on stream remoteStream remoteVideo.srcObject remoteStream Audio Call Implementation Get user media navigator.mediaDevices.getUserMedia audio true video false then stream localStream stream peer.addStream stream catch err console.error err Video Call Implementation navigator.mediaDevices.getUserMedia audio true video true then stream localStream stream localVideo.srcObject stream peer.addStream stream catch err console.error err Screen Sharing navigator.mediaDevices.getDisplayMedia video true then stream screenStream stream peer.replaceTrack stream.getVideoTracks 0 catch err console.error err Peer Connection Handle incoming signal socket.on signal data peer.signal data Handle connection peer.on connect console.log Connected peer Handle error peer.on error err console.error Peer error err Call Controls Mute Audio localStream.getAudioTracks forEach track track.enabled false Toggle Video localStream.getVideoTracks forEach track track.enabled false End Call peer.destroy localStream.getTracks forEach track track.stop WebRTC Configuration ICE Servers const configuration iceServers urls stun stun.l.google.com 19302 urls turn turn.example.com 3478 username user credential pass Group calls multi-participant support call quality optimization network adaptation low bandwidth handling",
    },
    {
      url: "update.html",
      title: "Update Guide",
      content:
        "Update Old New Version Updating Wapi Backup First Always backup before updating Backup database mongodump Backup files Copy project folder Backup .env file Version Compatibility Check release notes Review breaking changes Check dependency updates Test development first Update Process Frontend Update Navigate frontend cd wapi-frontend Pull latest code git pull Install new dependencies npm install Update .env needed Build new version npm run build Backend Update Navigate backend cd wapi-backend Pull latest code git pull Install new dependencies npm install Update .env file Run migrations npm run migrate Restart server pm2 restart wapi-backend Admin Update Navigate admin cd wapi-admin Pull latest code git pull Install new dependencies npm install Update .env file Restart admin panel Database Migration Check migrations Review migration files Run migrations npm run migrate Rollback needed npm run migrate rollback Breaking Changes Review changelog Check deprecated features Update API calls Update configurations Test thoroughly Common Update Issues Dependency conflicts Solution Delete node_modules npm install Database schema changes Solution Run migrations Seed new data API endpoint changes Solution Update frontend API calls Check documentation Configuration changes Solution Review .env.example Update .env file Version Checking Check current version Check package.json View changelog Visit repository Review release notes Compare versions Update best practices testing procedures rollback strategies version management",
    },
  ];

  /**
   * Initialize search functionality
   */
  function initSearch() {
    const searchInput = document.querySelector(
      '.home-search input[type="search"]'
    );
    const searchContainer = document.querySelector(".home-search");

    if (!searchInput || !searchContainer) return;

    // Create results container
    const resultsContainer = createResultsContainer();
    searchContainer.appendChild(resultsContainer);

    // Search input event
    let searchTimeout;
    searchInput.addEventListener("input", function (e) {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query.length < 2) {
        hideResults(resultsContainer);
        return;
      }

      searchTimeout = setTimeout(() => {
        performSearch(query, resultsContainer);
      }, 300);
    });

    // Close results when clicking outside
    document.addEventListener("click", function (e) {
      if (!searchContainer.contains(e.target)) {
        hideResults(resultsContainer);
      }
    });

    // Prevent closing when clicking inside results
    resultsContainer.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  /**
   * Create results container element
   */
  function createResultsContainer() {
    const container = document.createElement("div");
    container.className = "search-results-container";
    container.style.display = "none";
    return container;
  }

  /**
   * Perform search across all indexed pages
   */
  function performSearch(query, resultsContainer) {
    const results = searchInIndex(query);

    if (results.length === 0) {
      showNoResults(resultsContainer, `No results found for "${query}"`);
    } else {
      displayResults(results, query, resultsContainer);
    }
  }

  /**
   * Search through the index
   */
  function searchInIndex(query) {
    const results = [];
    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);

    // If query is too short, return empty
    if (normalizedQuery.length < 1) {
      return results;
    }

    SEARCH_INDEX.forEach((page) => {
      // Normalize content (case-insensitive)
      const searchText = (page.title + " " + page.content)
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ");

      let exactMatchCount = 0;
      let partialMatchCount = 0;
      let totalScore = 0;

      // Check for exact phrase match (highest priority)
      if (searchText.includes(normalizedQuery)) {
        totalScore += 100;
      }

      // Check each query word
      for (const word of queryWords) {
        if (word.length < 1) continue;

        // Exact word match (word boundary) - higher score
        const exactWordRegex = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
        if (exactWordRegex.test(searchText)) {
          exactMatchCount++;
          totalScore += 10;
        } else {
          // Partial match (substring) - lower score but still counts
          const partialRegex = new RegExp(escapeRegex(word), "i");
          if (partialRegex.test(searchText)) {
            partialMatchCount++;
            totalScore += 3;
          }
        }
      }

      // Match if we have any matches (exact or partial)
      if (exactMatchCount > 0 || partialMatchCount > 0 || totalScore > 0) {
        // Calculate relevance: prioritize exact matches
        const relevance =
          (exactMatchCount * 2 + partialMatchCount) /
          Math.max(queryWords.length, 1);
        const snippet = findRelevantSnippet(
          page.content,
          queryWords,
          normalizedQuery
        );
        results.push({
          page: page.title,
          url: page.url,
          snippet,
          relevance,
          matchCount: exactMatchCount + partialMatchCount,
          totalScore, // Use totalScore for better sorting
        });
      }
    });

    // Sort: prioritize by total score (exact phrase > exact words > partial matches), then relevance
    results.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return b.relevance - a.relevance;
    });

    return results.slice(0, 20);
  }

  /**
   * Find a relevant snippet containing search terms
   */
  function findRelevantSnippet(content, queryWords, normalizedQuery) {
    const text = content.replace(/\s+/g, " ").toLowerCase();
    let bestSentence = "";
    let maxMatches = 0;

    // First, try to find exact phrase match
    if (normalizedQuery && text.includes(normalizedQuery)) {
      const phraseIndex = text.indexOf(normalizedQuery);
      const start = Math.max(0, phraseIndex - 60);
      const end = Math.min(
        text.length,
        phraseIndex + normalizedQuery.length + 120
      );
      const snippet = text.substring(start, end);
      return snippet + "...";
    }

    // Otherwise, find best match for individual words (exact or partial)
    for (const word of queryWords) {
      if (word.length < 1) continue;

      // Try exact word match first
      let regex = new RegExp(`\\b${escapeRegex(word)}\\b`, "gi");
      let match = regex.exec(text);

      // If no exact match, try partial match
      if (!match) {
        regex = new RegExp(escapeRegex(word), "gi");
        match = regex.exec(text);
      }

      if (match) {
        const start = Math.max(0, match.index - 60);
        const end = Math.min(text.length, match.index + word.length + 120);
        const snippet = text.substring(start, end);

        // Count how many query words appear in this snippet (exact or partial)
        let matches = 0;
        for (const w of queryWords) {
          if (w.length < 1) continue;
          const exactRegex = new RegExp(`\\b${escapeRegex(w)}\\b`, "i");
          const partialRegex = new RegExp(escapeRegex(w), "i");
          if (exactRegex.test(snippet) || partialRegex.test(snippet)) {
            matches++;
          }
        }

        if (matches > maxMatches) {
          maxMatches = matches;
          bestSentence = snippet;
        }
      }
    }

    return bestSentence ? bestSentence + "..." : text.substring(0, 150) + "...";
  }

  /**
   * Highlight matching text (case-insensitive, supports partial matches)
   */
  function highlightText(text, query) {
    if (!query) return text;

    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);
    let highlightedText = text;

    // Use a placeholder to avoid double-highlighting
    const placeholder = "___HIGHLIGHT_PLACEHOLDER___";
    const placeholders = [];

    // First, protect already highlighted text (if any)
    let placeholderIndex = 0;
    highlightedText = highlightedText.replace(
      /<mark>([^<]*)<\/mark>/gi,
      (match, content) => {
        placeholders[placeholderIndex] = match;
        return placeholder + placeholderIndex++ + placeholder;
      }
    );

    // Highlight exact phrase first (if query has multiple words)
    if (normalizedQuery.length > 2 && queryWords.length > 1) {
      const phraseRegex = new RegExp(`(${escapeRegex(normalizedQuery)})`, "gi");
      highlightedText = highlightedText.replace(phraseRegex, "<mark>$1</mark>");
    }

    // Then highlight individual words (both exact and partial matches)
    queryWords.forEach((word) => {
      if (word.length > 0) {
        // Match word anywhere (partial match), case-insensitive, but not inside mark tags
        const regex = new RegExp(`(${escapeRegex(word)})`, "gi");
        highlightedText = highlightedText.replace(regex, "<mark>$1</mark>");
      }
    });

    // Restore protected highlights
    placeholders.forEach((original, index) => {
      highlightedText = highlightedText.replace(
        placeholder + index + placeholder,
        original
      );
    });

    // Clean up any nested mark tags (shouldn't happen, but just in case)
    highlightedText = highlightedText.replace(
      /<mark>(.*?)<mark>(.*?)<\/mark>(.*?)<\/mark>/gi,
      "<mark>$1$2$3</mark>"
    );

    return highlightedText;
  }

  /**
   * Escape regex special characters
   */
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Show no results message
   */
  function showNoResults(container, message) {
    container.innerHTML = `
      <div class="search-no-results">
        <i class="fa fa-search"></i>
        <p>${message}</p>
      </div>
    `;
    container.style.display = "block";
  }

  /**
   * Display search results
   */
  function displayResults(results, query, container) {
    const html = results
      .map((result) => {
        const highlightedSnippet = highlightText(result.snippet, query);
        const relevancePercent = Math.round(result.relevance * 100);

        // Preserve existing query parameters if any
        const urlWithQuery = result.url.includes("?")
          ? `${result.url}&q=${encodeURIComponent(query)}`
          : `${result.url}?q=${encodeURIComponent(query)}`;

        return `
        <a href="${urlWithQuery}" class="search-result-item">
          <div class="search-result-header">
            <span class="search-result-page">${result.page}</span>
            <span class="search-result-relevance">${relevancePercent}% match</span>
          </div>
          <div class="search-result-snippet">${highlightedSnippet}</div>
        </a>
      `;
      })
      .join("");

    container.innerHTML = `
    <div class="search-results-header">
      <span>Found ${results.length} result${
      results.length !== 1 ? "s" : ""
    }</span>
    </div>
    <div class="search-results-list">
      ${html}
    </div>
  `;
    container.style.display = "block";

    // Optional: handle click on results without full page reload (scroll smoothly)
    container.querySelectorAll(".search-result-item").forEach((link) => {
      link.addEventListener("click", (e) => {
        // Only if same page, prevent reload
        const linkUrl = new URL(link.href, window.location.origin);
        const currentUrl = window.location.href.split("?")[0];
        if (linkUrl.pathname === currentUrl) {
          e.preventDefault();
          const queryParam = linkUrl.searchParams.get("q");
          if (queryParam) {
            highlightAndScroll(queryParam);
          }
        }
      });
    });
  }

  /**
   * Hide results container
   */
  function hideResults(container) {
    container.style.display = "none";
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
  } else {
    initSearch();
  }
})();

// ===============================
// Global Scroll-to-Search Feature
// ===============================

(function () {
  // Run after page load
  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (!query) return;

    // Highlight and scroll
    highlightAndScroll(query);
  });

  function highlightAndScroll(query) {
    const safeQuery = query.trim();
    if (!safeQuery) return;

    const regex = new RegExp(`\\b(${escapeRegex(safeQuery)})\\b`, "gi");

    // Replace matches globally (works for all page content)
    document
      .querySelectorAll("p, li, td, span, div, h1, h2, h3, h4, h5, h6")
      .forEach((el) => {
        if (el.children.length === 0 && el.textContent.match(regex)) {
          el.innerHTML = el.innerHTML.replace(
            regex,
            `<mark class="search-highlight">$1</mark>`
          );
        }
      });

    // Scroll smoothly to first highlight
    const first = document.querySelector(".search-highlight");
    if (first) {
      first.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
})();
