# 🌀 Event Loop Working (Node.js) 

<img src="./img/eventloop.png">


## 1. Queues
- **Timers Queue** → `setTimeout`, `setInterval`
- **Poll Queue** → I/O callbacks (file, request, etc.)
- **Check Queue** → `setImmediate`
- **Close Queue** → close events (e.g. socket close)

## 2. Before Moving to Each Phase
- Runs `process.nextTick()`
- Runs **Promise callbacks (microtasks)**

## 3. Loop Behavior
- If **call stack is empty** and  
- All queues are empty →  
  👉 Event Loop **waits at Poll phase** for file, request, or other events

---

⚡ **Flow Summary:**
Sync code → Queues (Timers, Poll, Check, Close) → Microtasks (nextTick + Promises between phases) →  
Poll waits if nothing → Repeat

```js
const fs = require("fs");

setImmediate(() => console.log("setImmediate"));

setTimeout(() => console.log("Timer expired"), 0);

Promise.resolve("promise").then(console.log);

fs.readFile("./file.txt", "utf8", () => {
    setTimeout(() => console.log("2nd timer"), 0);

    process.nextTick(() => console.log("2nd nextTick"));

    setImmediate(() => console.log("2nd setImmediate"));

    console.log("File reading CB");
});

process.nextTick(() => console.log("Process.nextTick"));

console.log("Last line of the file");
//Output : 
// Last line of the file
// Process.nextTick
// promise
// Timer expired
// setImmediate
// File reading CB
// 2nd nextTick
// 2nd setImmediate
// 2nd timer

```
* A full cycle of event loop is known as one "Tick".

* epoll uses Red-Black Tree. Timers queue uses min-heap.

## Is JavaScript single-threaded or multi-threaded?  

- **JavaScript itself** → Single-threaded (executes on the main thread).  
- **When no asynchronous tasks** → runs purely single-threaded.  
- **When asynchronous tasks** (e.g., `fs`, `dns`, `crypto`) →  
  - These use **libuv’s threadpool** under the hood.  
  - So Node.js can make use of **multiple threads in the background**, while JS code still runs on one thread.  

---

## Can you change the threadpool size?  

✅ **Yes.**  

Set via environment variable:  
```js
process.env.UV_THREADPOOL_SIZE = 8;
```

- Default = 4

- Maximum = 128

## Do APIs use the thread pool?

❌ **No.**

- Networking tasks in Node.js (APIs, HTTP requests, sockets) do **not** use libuv’s thread pool.
- Instead, they rely on **OS-level mechanisms**:
  - **epoll** (Linux)
  - **kqueue** (macOS)

---

## Why not threads?

- If every request had its own thread → thousands of threads → ❌ inefficient.
- OS provides **efficient event notification systems** (epoll/kqueue).
- These can monitor **many sockets at once** without needing one thread per connection.

---

## How it works

- **Sockets** = file descriptors.
- OS kernel monitors them via **epoll/kqueue**.
- When activity happens (e.g., new request, data ready), the kernel notifies **libuv**.
- Node.js then processes it **asynchronously** on the single main thread.

---

✅ **Result:** Node.js can handle **thousands of connections** efficiently **without using the thread pool**.

# Node.js Notes

## What is a Server? 🖥️

A server can mean two things depending on context:

* **- **Hardware:** 🧱 A physical computer that provides resources or services to other machines over a network.*
* **- **Software:** ⚙️ A program that listens for requests and sends back responses.*

### Deploying an App on a Server 🚀

When someone says "deploy your app on a server," it usually means:

* 🖥️ You need a physical or virtual machine to run your app.
* 💿 That machine has an OS like Linux or Windows.
* 📡 Server software (like Node.js or Apache) handles incoming user requests.

## AWS and Cloud Computing ☁️

AWS provides cloud-based resources that let you run your applications without worrying about physical machines.

* **AWS (Amazon Web Services):** A platform that gives you access to servers, storage, databases, and more over the internet.
* **EC2 Instance:** 🖥️ When you launch one, you're renting a virtual server. AWS handles the hardware, networking, cooling, and reliability. You just deploy your application on the virtual machine.
* **Scalability:** 📈 You can increase or decrease RAM, CPU, or storage whenever needed. This is far easier compared to upgrading a personal computer.
* **Reliability:** 🔌 AWS data centers have backup power, strong internet, and redundant systems so your app stays available even if something fails.

## Can You Use Your Laptop as a Server? 💻

Yes, but with several limitations:

* **Hardware Constraints:** Laptops are not built for heavy server loads. Limited RAM, CPU, and storage make them unsuitable for handling many requests.
* **Internet Limitations:** Home internet is unstable, slower, and usually has dynamic IPs. Hosting a public server requires stable connectivity and a fixed IP.
* **Power & Maintenance:** Keeping a laptop running 24/7, managing heat, and ensuring backup power is difficult. Cloud providers automatically handle all these issues.
  ? 💻
  Yes, but with limitations:
* **Hardware:** Limited RAM/CPU/storage.
* **Internet:** Home networks are unstable and often use dynamic IPs.
* **Power & Maintenance:** Keeping it always on is tough. Cloud handles this.

## Software Servers in Node.js ⚙️

Creating an HTTP server means building an app that listens for client requests and responds.

## Client-Server Architecture 🌐

* **Client:** The user or browser accessing resources.
* **Socket Connection:** Temporary connection between client and server.
* **Multiple Clients:** Each opens its own socket, gets data, closes it.
* **Based on TCP/IP:** Protocols that manage reliable data transfer.

## What Is a Protocol? 📜

Rules for how computers communicate.

* **FTP:** File transfers.
* **SMTP:** Sending emails.
* **HTTP:** Main protocol for web servers.

## How Is Data Sent in a Server Request? 📦

* Data is broken into **packets**.
* TCP/IP handles sending and managing these packets.
* In Node.js, **streams** and **buffers** help handle data transmission.

## Domain Names and DNS 🌍

We don’t normally type IP addresses like `142.250.190.14` into the browser. Instead, we use names like **youtube.com**, because humans remember words far better than long number strings. But behind the scenes, every domain eventually maps to an IP address.

This works very similar to how you save contacts on your phone. You tap on "Mom" instead of remembering her phone number, but the phone still uses the number internally. In the same way, when you type a URL, your system converts it into an IP address.

### How DNS Works 🧭

* **DNS (Domain Name System)** is like the internet's phonebook.
* When you enter a domain name, your browser asks a DNS server to find the matching IP address.
* Once the DNS server returns the correct IP, your device sends a request directly to that server.

### What Happens Behind the Scenes 🔍

After the IP is resolved, your browser sends a request to the server where an **HTTP server** processes it.

* The server responds with the requested data.
* The data isn’t sent all at once. It’s broken into **chunks**, also known as **streams**.
* While receiving these chunks, your browser uses **buffers** to manage the flow of data.

This is why videos sometimes **buffer**. The browser is waiting for enough chunks to arrive before playing smoothly.

## Creating Multiple Servers 🔌

You can create multiple HTTP servers in Node.js. Each server runs as a separate application, and the way we differentiate them is through **ports**.

### How Do We Know Which Server a Request Should Go To?

If you create two Node.js servers, you're essentially running two different applications. Each one listens on a unique port such as **3000**, **3001**, etc.

Example:

* An HTTP server running on **IP: 102.209.1.3** and **port: 3000** is reached using **102.209.1.3:3000**.
* The same machine can run another server on **port 3001**, accessed via **102.209.1.3:3001**.

A single computer can host many applications. The **port number** helps the operating system route the incoming request to the correct application.

## Mapping Domains, IPs, Ports, and Paths 🌐

When you enter a domain like `youtube.com`, the DNS resolves it to an IP address. That IP identifies the server. After that:

* **IP + port** identifies which application on that server should handle the request.
* **IP + port + path** identifies which route or API should be invoked.

Examples:

* **102.209.1.3:3000** could host a React app.
* **102.209.1.3:3001** could host a Node.js API.

Paths allow more structure:

* `youtube.com` → React (port 3000)
* `youtube.com/api/...` → Node.js (port 3001)

Example configuration for **namastedev.com**:

* `namastedev.com` → React on port 3000
* `namastedev.com/node` → Node.js on port 3001

This setup helps manage multiple applications on a single server using ports and paths.

## Distributed Server Architecture 🏗️

Large companies rarely use a single server for everything. Instead, they distribute responsibilities across multiple servers.

### 1. Frontend Server

Serves HTML, CSS, JS files. This is what users see and interact with.

### 2. Backend Server

Handles business logic, processes requests, interacts with databases.

### 3. Dedicated Database Server

Optimized only for storing and retrieving data. Backend communicates with this server.

### 4. Media and File Servers

Videos, images, and large files are hosted separately, often via CDNs for fast global delivery.

### 5. Inter-Server Communication

Frontend and backend servers request data from media servers, database servers, or other microservices.

Example architecture for **namastedev.com**:

* **Frontend + Backend:** Hosted on AWS
* **Database:** Separate database server
* **Videos:** Media server optimized for streaming
* **Images:** CDN for fast delivery

This distributed approach improves scalability, reliability, and performance.

## Socket vs WebSockets 🧵

### Regular Sockets

* A socket connection is created when a client makes a request.
* The server responds.
* The connection closes.
* For every new request, a new socket connection must be created.

This is fine for normal websites but inefficient for real-time apps.

### WebSockets

WebSockets create a **persistent open connection**.

* After the initial handshake, the connection stays open.
* Both client and server can send data anytime.
* No need to reconnect for each message.

Perfect for:

* Chat apps
* Live notifications
* Online gaming
* Real-time dashboards


## Databases – SQL & NoSQL

### What Is a Database? 🗄️

A database is an organized collection of data, managed using a **Database Management System (DBMS)**. It interacts with users, applications, and the data itself to store, process, and retrieve information.  

---

## Types of Databases

### 1. Relational Databases (RDBMS) – MySQL, PostgreSQL 🧩

They use structured tables with predefined schemas. Great for complex queries, ACID transactions, and strong data integrity.  

### 2. NoSQL Databases – MongoDB 📄

Store flexible JSON-like documents with dynamic schemas. Highly scalable and ideal for unstructured or semi-structured data.  

### 3. In-Memory Databases – Redis ⚡

Stores data in memory for extremely fast access. Used for caching, analytics, message brokering.  

### 4. Distributed SQL – CockroachDB 🌍

Horizontally scalable SQL database with strong consistency and ACID transactions.  

### 5. Time-Series DB – InfluxDB ⏱️

Optimized for time-stamped data, monitoring, IoT, and real-time analytics.  

### 6. Object-Oriented DB – db4o 🧱

Stores data as objects directly, matching object-oriented programming models.  

### 7. Graph DB – Neo4j 🕸️

Handles complex relationships using nodes and edges. Used in social networks, recommendation systems.  

### 8. Hierarchical DB – IBM IMS 🌳

Stores data in parent-child tree structures. Used in legacy high-performance systems.  

### 9. Network DB – IDMS 🔗

More complex relationships than hierarchical DBs. Used in legacy systems.  

### 10. Cloud DB – Amazon RDS ☁️

Managed relational DB service supporting MySQL, PostgreSQL, Oracle. Handles backups, patching, scaling. 

Most commonly used:

* **Relational DB**
* **NoSQL DB**

---

## RDBMS: The Story Behind MySQL & PostgreSQL

### EF Codd & Codd’s 12 Rules 📐

EF Codd introduced 12 rules (numbered 0–12) defining what makes a database *relational*. Must have multiple tables and relationships.  

### MySQL Origin Story 👶

Created by **Michael Widenius**. Named after his daughter *My*. Later forks:

* **MaxDB** after son Max
* **MariaDB** after daughter Maria
  MySQL was acquired by Sun Microsystems, later by Oracle. MariaDB was created as a fork.  

### PostgreSQL Origin Story 🧑‍🏫

Created by **Michael Stonebraker** during the Ingres project. Successor project “Post Ingres” evolved into PostgreSQL, using SQL heavily for data querying.  

---

## NoSQL & MongoDB

Types of NoSQL Databases:

1. Document DBs
2. Key-Value DBs
3. Graph DBs
4. Wide-Column DBs
5. Multi-Model DBs

MongoDB (created in **2009**) works extremely well with JavaScript and JSON. The name comes from “humongous,” highlighting its ability to handle huge data. Built by **10gen** (now MongoDB Inc.).  

---

## RDBMS vs NoSQL (Document DB)

### RDBMS

* Uses **tables** (rows & columns)
* Uses **foreign keys** for relationships
* Requires **normalization** to remove redundancy
* Often needs **joins** to fetch related data
* Fixed schema

### NoSQL (e.g., MongoDB)

* Uses flexible **document structures** (JSON-like)
* Groups records in **collections** instead of tables
* Stores related data in a **single document** (no joins needed)
* Schema is **dynamic and flexible**
* Integrates naturally with JavaScript

### Key Differences

* **Structure:** Tables vs documents
* **Schema:** Fixed vs flexible
* **Query Language:** SQL vs custom queries
* **Scaling:** RDBMS struggles with horizontal scaling; NoSQL excels at it
* **Use Cases:** RDBMS for transactions; NoSQL for high-performance, flexible data models
* **Examples:** Banking apps (RDBMS) vs content systems, real-time analytics (NoSQL)  
