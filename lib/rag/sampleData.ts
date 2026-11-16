import { Topic, DocumentChunk, QuizQuestion } from "../types";

export const SAMPLE_TOPICS: Topic[] = [
  {
    id: "topic-1",
    name: "Physical & Data Link Layer Protocols",
    category: "Layer 1 & Layer 2",
    examWeightage: 30, // 30% of exam weight
    subtopics: [
      {
        id: "sub-1-1",
        title: "Transmission Media (Guided vs Unguided)",
        description: "Twisted-pair, coaxial cable, optical fiber propagation modes (step-index, graded-index), and wireless radio/microwaves.",
        examFrequency: "HIGH",
        pastQuestionsCount: 8,
      },
      {
        id: "sub-1-2",
        title: "Framing & Error Detection (CRC, Checksum, Hamming Code)",
        description: "Byte stuffing, bit stuffing with 01111110 flags, parity checks, and cyclic redundancy check binary division.",
        examFrequency: "HIGH",
        pastQuestionsCount: 11,
      },
      {
        id: "sub-1-3",
        title: "Sliding Window Protocols (Stop-and-Wait, Go-Back-N, Selective Repeat)",
        description: "Window size limits (2^m - 1 vs 2^(m-1)), cumulative ACKs, timers, and bandwidth-delay product link utilization.",
        examFrequency: "HIGH",
        pastQuestionsCount: 14,
      },
      {
        id: "sub-1-4",
        title: "Multiple Access Protocols (Pure ALOHA, Slotted ALOHA, CSMA/CD)",
        description: "Vulnerable time, collision detection minimum frame size (512 bits / 64 bytes for Standard Ethernet), 1-persistent and p-persistent.",
        examFrequency: "HIGH",
        pastQuestionsCount: 12,
      },
    ],
  },
  {
    id: "topic-2",
    name: "Network Layer Routing & Addressing",
    category: "Layer 3",
    examWeightage: 30,
    subtopics: [
      {
        id: "sub-2-1",
        title: "Routing Algorithms (Dijkstra Shortest Path & Flooding)",
        description: "Sink tree optimality principle, Dijkstra tentative vs permanent nodes, hop count limits in selective flooding.",
        examFrequency: "HIGH",
        pastQuestionsCount: 10,
      },
      {
        id: "sub-2-2",
        title: "Distance Vector vs Link State Routing",
        description: "Bellman-Ford sharing with neighbors, count-to-infinity problem, split horizon & poison reverse, OSPF link state packets (LSP).",
        examFrequency: "HIGH",
        pastQuestionsCount: 9,
      },
      {
        id: "sub-2-3",
        title: "Congestion Control & Traffic Shaping (Leaky vs Token Bucket)",
        description: "Choke packets, hop-by-hop choke, RED random early discard, leaky bucket constant rate vs token bucket burst tolerance.",
        examFrequency: "MEDIUM",
        pastQuestionsCount: 7,
      },
      {
        id: "sub-2-4",
        title: "IP Addressing & Datagram vs Virtual Circuit",
        description: "Connectionless datagram forwarding tables vs connection-oriented virtual circuit identifiers (VCI) and setup/teardown phases.",
        examFrequency: "MEDIUM",
        pastQuestionsCount: 6,
      },
    ],
  },
  {
    id: "topic-3",
    name: "Transport Layer Protocols (TCP & UDP)",
    category: "Layer 4",
    examWeightage: 25,
    subtopics: [
      {
        id: "sub-3-1",
        title: "TCP 3-Way Handshake Connection Establishment & Teardown",
        description: "SYN, SYN+ACK, ACK segments, initial sequence numbers (ISN), FIN/ACK four-way release, and half-close operation.",
        examFrequency: "HIGH",
        pastQuestionsCount: 12,
      },
      {
        id: "sub-3-2",
        title: "TCP Sliding Window & Flow Control",
        description: "Byte-oriented numbering, advertised receiver window (rwnd), Nagle's rule, silly window syndrome, and window probe segments.",
        examFrequency: "HIGH",
        pastQuestionsCount: 8,
      },
      {
        id: "sub-3-3",
        title: "TCP Congestion Control (Tahoe, Reno, AIMD)",
        description: "Slow start exponential increase, congestion avoidance additive increase, threshold (ssthresh = cwnd/2), fast retransmit, and fast recovery.",
        examFrequency: "HIGH",
        pastQuestionsCount: 11,
      },
      {
        id: "sub-3-4",
        title: "UDP Protocol & RPC Remote Procedure Calls",
        description: "Connectionless, unreliable user datagram format, optional 16-bit checksum with pseudoheader, client stub & server stub marshaling.",
        examFrequency: "MEDIUM",
        pastQuestionsCount: 5,
      },
    ],
  },
  {
    id: "topic-4",
    name: "Application Layer & Network Services",
    category: "Layer 5 - Layer 7",
    examWeightage: 15,
    subtopics: [
      {
        id: "sub-4-1",
        title: "DNS Domain Name System & Hierarchy",
        description: "Generic & country domains, root servers, primary/secondary zone files, recursive vs iterative resolution, caching, and port 53 UDP/TCP.",
        examFrequency: "MEDIUM",
        pastQuestionsCount: 6,
      },
      {
        id: "sub-4-2",
        title: "HTTP, WWW Architecture & Web Documents",
        description: "Client-server distributed architecture, URLs, HTTP 1.1 persistent connections, cookies, static vs dynamic (CGI) vs active documents.",
        examFrequency: "MEDIUM",
        pastQuestionsCount: 4,
      },
      {
        id: "sub-4-3",
        title: "TELNET & Network Virtual Terminal (NVT)",
        description: "Client-server remote login, terminal driver, pseudoterminal driver, and universal NVT character set translation.",
        examFrequency: "LOW",
        pastQuestionsCount: 3,
      },
    ],
  },
];

export const SAMPLE_CHUNKS: DocumentChunk[] = [
  {
    id: "chk-cn-1",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit I: Physical Structures & Topologies",
    pageOrSlide: "Page 11-12",
    topicId: "topic-1",
    subtopicId: "sub-1-1",
    content:
      "A mesh topology is one where every node is connected to every other node in the network. In a full mesh topology, every computer has a connection to each of the other computers. The number of connections can be calculated using the formula n(n-1)/2, where n is the number of computers. In star topology, every node connects to a central hub, switch, or computer. If one computer fails, the rest continue to operate, but if the central hub fails, the entire network goes down.",
  },
  {
    id: "chk-cn-2",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit I: Guided Transmission Media - Optical Fiber",
    pageOrSlide: "Page 18-19",
    topicId: "topic-1",
    subtopicId: "sub-1-1",
    content:
      "Optical fibers use reflection to guide light through a channel. A glass or plastic core is surrounded by a cladding of less dense glass or plastic. In multimode step-index fiber, the density of the core remains constant from the center to the edges. A beam of light moves in a straight line until it reaches the core-cladding interface. In multimode graded-index fiber, the index of refraction decreases distortion. Optical fiber provides higher bandwidth, less attenuation (signals run 50 km without repeaters), and complete immunity to electromagnetic interference.",
  },
  {
    id: "chk-cn-3",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit II: Data Link Layer - Framing & Bit Stuffing",
    pageOrSlide: "Page 41-43",
    topicId: "topic-1",
    subtopicId: "sub-1-2",
    content:
      "Starting and ending flags with bit stuffing allows data frames to contain an arbitrary number of bits. Each frame begins and ends with a special bit pattern, 01111110 (flag byte). Whenever the sender's data link layer encounters five consecutive 1s in the data, it automatically stuffs a 0 bit into the outgoing bit stream. When the receiver sees five consecutive incoming 1 bits followed by a 0 bit, it automatically deletes (de-stuffs) the 0 bit. If user data contains 01111110, it is transmitted as 011111010.",
  },
  {
    id: "chk-cn-4",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit II: Data Link Layer - Sliding Window Protocols",
    pageOrSlide: "Page 47-51",
    topicId: "topic-1",
    subtopicId: "sub-1-3",
    content:
      "Bandwidth Delay Product: If line bandwidth is 1 Mbps and 1 bit takes 20 ms round trip, bandwidth-delay product is 20,000 bits. With 1000-bit frames, link utilization in Stop-and-Wait is only 5%. To improve efficiency, Go-Back-N ARQ allows multiple frames in transition. Sequence numbers are modulo 2^m. The send window size is 2^m - 1, and the receiver window size is 1. In Selective Repeat ARQ, the receiver window size is equal to the sender window size, which must be at most 2^(m-1) (one-half of 2^m).",
  },
  {
    id: "chk-cn-5",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit II: Multiple Access - CSMA/CD Minimum Frame Size",
    pageOrSlide: "Page 62-64",
    topicId: "topic-1",
    subtopicId: "sub-1-4",
    content:
      "For CSMA/CD to work, the frame transmission time Tfr must be at least two times the maximum propagation time Tp (Tfr >= 2 * Tp). On a 10 Mbps network with maximum propagation delay of 25.6 microseconds, the minimum transmission time is 51.2 microseconds. Minimum frame size = 10 Mbps * 51.2 us = 512 bits or 64 bytes. This represents the minimum frame size for Standard Ethernet.",
  },
  {
    id: "chk-cn-6",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit III: Network Layer - Shortest Path & Dijkstra",
    pageOrSlide: "Page 87-88",
    topicId: "topic-2",
    subtopicId: "sub-2-1",
    content:
      "The Optimality Principle states that if router J is on the optimal path from router I to router K, then the optimal path from J to K falls along the same route. The set of optimal routes from all sources to a given destination form a tree rooted at the destination, called a sink tree. Dijkstra algorithm finds shortest paths by maintaining tentative and permanent node sets. Start with local root at cost 0, examine neighbors, assign cumulative costs, and promote the lowest cost tentative node to permanent.",
  },
  {
    id: "chk-cn-7",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit III: Routing - Distance Vector Instability Solutions",
    pageOrSlide: "Page 93-94",
    topicId: "topic-2",
    subtopicId: "sub-2-2",
    content:
      "Distance Vector Routing suffers from the count-to-infinity problem during link failures. Solutions: 1. Defining Infinity: set infinity to a small number like 16 hops. 2. Split Horizon: a router never advertises a route back to the neighbor from which it learned that route. 3. Split Horizon with Poison Reverse: instead of omitting the route, the router advertises the distance as infinity ('warning: do not use this value; what I know about this route came from you').",
  },
  {
    id: "chk-cn-8",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit III: Congestion Control - Leaky Bucket vs Token Bucket",
    pageOrSlide: "Page 104-105",
    topicId: "topic-2",
    subtopicId: "sub-2-3",
    content:
      "Traffic Shaping: Leaky bucket enforces a constant average output rate regardless of the burstiness of the input; if the buffer overflows, packets are discarded. In contrast, the Token Bucket algorithm allows the output rate to vary depending on the burst size. Tokens are generated at a constant rate every delta-t. Idle hosts can save up tokens up to the maximum capacity of the bucket, allowing large bursts to be transmitted at full speed.",
  },
  {
    id: "chk-cn-9",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit IV: Transport Layer - TCP Connection Establishment",
    pageOrSlide: "Page 125, 148-150",
    topicId: "topic-3",
    subtopicId: "sub-3-1",
    content:
      "TCP Connection Establishment uses a 3-way handshake to prevent delayed duplicates from causing false connections. 1. Client sends SYN (consumes 1 sequence number, no data). 2. Server replies with SYN + ACK (acknowledges client sequence number + 1, announces server initial sequence number, consumes 1 sequence number). 3. Client sends ACK (acknowledges server sequence number + 1, consumes 0 sequence numbers if no data). SYN Flooding Attack exploits this by sending massive SYN segments with spoofed IP addresses to exhaust server connection tables.",
  },
  {
    id: "chk-cn-10",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit IV: Transport Layer - TCP Congestion Control (AIMD & Tahoe/Reno)",
    pageOrSlide: "Page 171, 174-179",
    topicId: "topic-3",
    subtopicId: "sub-3-3",
    content:
      "TCP Congestion Control uses Additive Increase Multiplicative Decrease (AIMD). The effective window is min(rwnd, cwnd). In Slow Start, cwnd starts at 1 segment and doubles every RTT (exponential growth) until reaching the threshold ssthresh. Once cwnd >= ssthresh, Congestion Avoidance begins, increasing cwnd linearly by 1 segment per RTT. When a timeout occurs, ssthresh is set to cwnd/2 and cwnd resets to 1 (slow start). In TCP Reno, receiving 3 duplicate ACKs triggers Fast Retransmit and Fast Recovery: ssthresh is halved, and cwnd starts at ssthresh instead of dropping to 1.",
  },
  {
    id: "chk-cn-11",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit IV: Transport Layer - UDP Format & RPC Marshaling",
    pageOrSlide: "Page 185-187, 192-193",
    topicId: "topic-3",
    subtopicId: "sub-3-4",
    content:
      "UDP is a connectionless, unreliable transport protocol. The user datagram has an 8-byte header: Source port (16 bits), Destination port (16 bits), Total length (16 bits), and Checksum (16 bits). Checksum calculation includes a 12-byte pseudoheader containing source IP, destination IP, all 0s, protocol 17, and UDP total length. In Remote Procedure Call (RPC), the client stub packs parameters into a network message (marshaling) and transmits it to the server stub which unmarshals parameters and invokes the procedure.",
  },
  {
    id: "chk-cn-12",
    docTitle: "Computer Networks Lecture Notes [R15A0513]",
    section: "Unit V: Application Layer - DNS Hierarchy & Resolution",
    pageOrSlide: "Page 290-294, 304-306",
    topicId: "topic-4",
    subtopicId: "sub-4-1",
    content:
      "DNS maps human-readable domain names to IP addresses. The domain name space is an inverted tree structure with up to 128 levels. In recursive resolution, the resolver asks the local DNS server, which takes full responsibility to query root servers and intermediate servers until finding the final answer. In iterative resolution, if a server cannot resolve the query, it returns the IP address of the next authoritative server to the client to query directly. DNS uses port 53 over UDP (for standard lookups) and TCP (for zone transfers).",
  },
];

export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-cn-1",
    topicId: "topic-1",
    topicName: "Physical & Data Link Layer Protocols",
    subtopicId: "sub-1-2",
    subtopicName: "Framing & Error Detection (CRC, Checksum, Hamming Code)",
    question:
      "In the bit stuffing framing algorithm, what does the sender's data link layer do whenever it encounters five consecutive 1s in the user data?",
    options: [
      "Stuffs an escape byte (ESC) before the flag",
      "Automatically stuffs a 0 bit into the outgoing stream",
      "Discards the current frame and sends a NAK",
      "Increments the sequence number by modulo-2",
    ],
    correctAnswerIndex: 1,
    explanation:
      "According to lecture notes, whenever the sender encounters five consecutive 1s in the data, it automatically stuffs a 0 bit. The receiver detects five consecutive 1s followed by a 0 and automatically de-stuffs (deletes) that 0 bit.",
    citation: {
      documentTitle: "Computer Networks Lecture Notes [R15A0513]",
      section: "Unit II: Data Link Layer - Framing & Bit Stuffing",
      pageOrChapter: "Page 43",
      verbatimSnippet:
        "Whenever the sender's data link layer encounters five consecutive 1s in the data, it automatically stuffs a 0 bit into the outgoing bit stream.",
    },
  },
  {
    id: "q-cn-2",
    topicId: "topic-1",
    topicName: "Physical & Data Link Layer Protocols",
    subtopicId: "sub-1-3",
    subtopicName: "Sliding Window Protocols (Stop-and-Wait, Go-Back-N, Selective Repeat)",
    question:
      "In Selective Repeat ARQ, if sequence numbers are numbered using modulo 2^m, what is the maximum permissible size of the sender and receiver windows to avoid overlap?",
    options: [
      "2^m - 1",
      "2^m",
      "2^(m - 1) (at most one-half of 2^m)",
      "Always fixed at 1",
    ],
    correctAnswerIndex: 2,
    explanation:
      "In Go-Back-N, the send window is 2^m - 1 and receive window is 1. But in Selective Repeat ARQ, the receiver window is equal to the send window, and both must be at most 2^(m-1), which is half of 2^m.",
    citation: {
      documentTitle: "Computer Networks Lecture Notes [R15A0513]",
      section: "Unit II: Sliding Window Protocols - Selective Repeat ARQ",
      pageOrChapter: "Page 51-52",
      verbatimSnippet:
        "In Selective Repeat ARQ, the size of the sender and receiver window must be at most one-half of 2^m (2^(m-1)).",
    },
  },
  {
    id: "q-cn-3",
    topicId: "topic-1",
    topicName: "Physical & Data Link Layer Protocols",
    subtopicId: "sub-1-4",
    subtopicName: "Multiple Access Protocols (Pure ALOHA, Slotted ALOHA, CSMA/CD)",
    question:
      "Why does Standard 10 Mbps Ethernet have a mandatory minimum frame size of 512 bits (64 bytes)?",
    options: [
      "To ensure the frame transmission time (Tfr) is at least twice the maximum round-trip propagation delay (2 * Tp) to detect collisions before finishing transmission",
      "To provide enough space for 8 different CRC-32 checksums",
      "Because Ethernet cables cannot carry electrical current for less than 1 millisecond",
      "To match the receiver window buffer size in Go-Back-N ARQ",
    ],
    correctAnswerIndex: 0,
    explanation:
      "In CSMA/CD, the transmitting station does not keep a copy once a frame is sent. Therefore, Tfr must be >= 2 * Tp so the sender detects a collision while still transmitting. For 10 Mbps and 25.6 us propagation, Tfr = 51.2 us, requiring 512 bits (64 bytes).",
    citation: {
      documentTitle: "Computer Networks Lecture Notes [R15A0513]",
      section: "Unit II: Minimum Frame Size in CSMA/CD",
      pageOrChapter: "Page 63-64",
      verbatimSnippet:
        "The frame transmission time Tfr must be at least two times the maximum propagation time Tp. 10 Mbps * 51.2 us = 512 bits or 64 bytes.",
    },
  },
  {
    id: "q-cn-4",
    topicId: "topic-2",
    topicName: "Network Layer Routing & Addressing",
    subtopicId: "sub-2-2",
    subtopicName: "Distance Vector vs Link State Routing",
    question:
      "How does the 'Split Horizon with Poison Reverse' strategy prevent routing loops in Distance Vector routing?",
    options: [
      "It completely disables all routing updates for 30 minutes",
      "If node B learns a route to X from node A, node B advertises that route back to node A with a distance of infinity",
      "It sends an ICMP Source Quench choke packet to all neighboring nodes",
      "It forces the router to switch from datagram switching to virtual circuit switching",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Under poison reverse, instead of hiding the route, node B advertises the distance to X as infinity when reporting to node A, warning node A not to route packets back through B.",
    citation: {
      documentTitle: "Computer Networks Lecture Notes [R15A0513]",
      section: "Unit III: Solutions for Distance Vector Instability",
      pageOrChapter: "Page 94",
      verbatimSnippet:
        "Node B can still advertise the value for X, but if the source of information is A, it can replace the distance with infinity as a warning: 'Do not use this value; what I know about this route comes from you.'",
    },
  },
  {
    id: "q-cn-5",
    topicId: "topic-2",
    topicName: "Network Layer Routing & Addressing",
    subtopicId: "sub-2-3",
    subtopicName: "Congestion Control & Traffic Shaping (Leaky vs Token Bucket)",
    question:
      "What is the primary difference between the Leaky Bucket algorithm and the Token Bucket algorithm for traffic shaping?",
    options: [
      "Leaky bucket runs only on the data link layer, while token bucket runs on the physical layer",
      "Leaky bucket enforces a constant average output rate, whereas token bucket allows large bursts to be transmitted at full speed if tokens are saved",
      "Token bucket discards packets whenever incoming data exceeds 1000 bytes",
      "Leaky bucket uses modulo 16 arithmetic, while token bucket uses modulo 2",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Leaky bucket discards packets if the buffer overflows and transmits at a constant rate regardless of input burstiness. Token bucket stores tokens at a fixed rate, enabling an idle host to save tokens and transmit bursts of packets when needed.",
    citation: {
      documentTitle: "Computer Networks Lecture Notes [R15A0513]",
      section: "Unit III: Congestion Control - Leaky Bucket vs. Token Bucket",
      pageOrChapter: "Page 105",
      verbatimSnippet:
        "LB sends packets at an average rate. TB allows for large bursts to be sent faster by speeding up the output. TB allows saving up tokens (permissions) to send large bursts.",
    },
  },
  {
    id: "q-cn-6",
    topicId: "topic-3",
    topicName: "Transport Layer Protocols (TCP & UDP)",
    subtopicId: "sub-3-1",
    subtopicName: "TCP 3-Way Handshake Connection Establishment & Teardown",
    question:
      "During the TCP 3-way handshake connection establishment, why does the SYN segment consume one sequence number even when carrying 0 bytes of payload?",
    options: [
      "Because the IP header requires a 16-bit pseudoheader",
      "To ensure that the SYN itself can be reliably acknowledged by the other party with ACK = SYN_seq + 1",
      "Because the receiver window size is automatically shrunk to zero",
      "To prevent Nagle's algorithm from running during connection phase",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Control flags like SYN and FIN consume exactly one sequence number so that the peer can acknowledge their receipt by incrementing the expected acknowledgment number by 1.",
    citation: {
      documentTitle: "Computer Networks Lecture Notes [R15A0513]",
      section: "Unit IV: TCP Connection Establishment (3 way handshaking)",
      pageOrChapter: "Page 148",
      verbatimSnippet:
        "A SYN segment cannot carry data, but it consumes one sequence number. The server sends SYN + ACK acknowledging the SYN segment.",
    },
  },
  {
    id: "q-cn-7",
    topicId: "topic-3",
    topicName: "Transport Layer Protocols (TCP & UDP)",
    subtopicId: "sub-3-3",
    subtopicName: "TCP Congestion Control (Tahoe, Reno, AIMD)",
    question:
      "In TCP Reno, what happens when a sender receives 3 duplicate ACKs for the same segment (Fast Retransmit & Fast Recovery)?",
    options: [
      "The sender aborts the connection and initiates a four-way FIN handshake",
      "The sender resets cwnd to 1 segment and restarts slow start from scratch",
      "The sender retransmits the missing segment immediately and sets ssthresh = cwnd / 2, entering fast recovery with cwnd set to ssthresh instead of 1",
      "The sender transmits a 1-byte window probe segment to check buffer status",
    ],
    correctAnswerIndex: 2,
    explanation:
      "In TCP Tahoe, 3 duplicate ACKs reset cwnd to 1 (slow start). But in TCP Reno, Fast Recovery takes over: ssthresh is halved, the missing segment is retransmitted, and cwnd starts at ssthresh, avoiding the harsh drop back to 1.",
    citation: {
      documentTitle: "Computer Networks Lecture Notes [R15A0513]",
      section: "Unit IV: TCP Congestion Control - Fast Retransmit & Reno",
      pageOrChapter: "Page 179-181",
      verbatimSnippet:
        "If three or more duplicate ACKs are received, TCP performs a retransmission... TCP Reno (1990) adds Fast Recovery with the sawtooth pattern.",
    },
  },
  {
    id: "q-cn-8",
    topicId: "topic-4",
    topicName: "Application Layer & Network Services",
    subtopicId: "sub-4-1",
    subtopicName: "DNS Domain Name System & Hierarchy",
    question:
      "What is the difference between Recursive Resolution and Iterative Resolution in DNS?",
    options: [
      "Recursive resolution uses UDP port 53, while iterative resolution uses TCP port 80",
      "In recursive resolution, the contacted server takes full responsibility to query other servers until the final answer is found; in iterative resolution, the server returns the IP of the next authority for the client to query",
      "Recursive resolution works only for country domains (.us, .in), whereas iterative resolution is for generic domains (.com, .edu)",
      "Recursive resolution requires an encrypted cookie, whereas iterative resolution does not",
    ],
    correctAnswerIndex: 1,
    explanation:
      "In recursive resolution, the client relies on the DNS resolver/server to recurse through root and top-level servers and return the final answer. In iterative resolution, the server replies with a referral containing the IP address of another server for the client to contact.",
    citation: {
      documentTitle: "Computer Networks Lecture Notes [R15A0513]",
      section: "Unit V: Domain Name System - Recursive vs Iterative Resolution",
      pageOrChapter: "Page 304-306",
      verbatimSnippet:
        "Recursive Resolution: The client (resolver) expects the server to supply the final answer. Iterative Resolution: If the server is not an authority, it returns the IP address of the server that it thinks can resolve the query.",
    },
  },
];
