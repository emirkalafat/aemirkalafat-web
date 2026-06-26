export type CategoryType = 'DEV' | 'E-ENG' | 'THEORY'

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; icon: string }
  | { type: 'code'; language: string; lines: string[] }

export interface BlogPost {
  id: string
  category: CategoryType
  date: string
  readTime: string
  title: string
  description: string
  imageUrl?: string
  isFeatured?: boolean
  isWide?: boolean
  relatedIds?: string[]
  content?: ContentBlock[]
}

export const blogPosts: BlogPost[] = [
  {
    id: 'LOG-FEAT-001',
    category: 'E-ENG',
    date: '2024.10.24',
    readTime: '14m',
    title: 'Reverse Engineering the ARM Cortex-M4 Architecture',
    description: 'A deep dive into bypassing JTAG protection mechanisms on consumer IoT devices using voltage glitching and differential power analysis. We explore the structural vulnerabilities inherent in low-cost MCU implementations.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsWkb91Ar7NWRDrruAC5VRebqB2vI-BOrDNmo144NygegbcSPZJuj2BsHrVTeEj-X9phaF_4KBVtAf0r8Hlus5GzcEou8sbrPFmzLHm2tQKYKRIAsaS8KG39AtBRxfygAjvXDcbdYZDrLOIw-TyGzt00fRv0pGAmJBwnlCwVS8q_P6P6IKEhPufLnhsZHL8WqegbtuP6sRnA3UPYyjQ_8lrYDW-aorhuYqFH7kYRGILY_KU9mhIObYbSe-s0QIKvSW3TY',
    isFeatured: true,
    relatedIds: ['LOG-003', 'LOG-WIDE-001'],
    content: [
      {
        type: 'paragraph',
        text: 'The ARM Cortex-M4 is the backbone of a significant portion of commercial IoT hardware. Its debug interface, JTAG/SWD, is protected by a single lock bit in non-volatile memory. Once that bit is set, the debug port is disabled. However, the protection model assumes that the attacker cannot control the power supply rail.',
      },
      {
        type: 'heading',
        text: 'Voltage Glitching the Lock Bit',
        icon: 'bolt',
      },
      {
        type: 'paragraph',
        text: 'By introducing a precise voltage spike on the VDD rail during the boot sequence — specifically in the 50–200ns window when the device reads the option bytes — we can force a bit-flip in SRAM that bypasses the protection check. This technique requires a pulse generator with sub-nanosecond resolution and careful oscilloscope alignment.',
      },
      {
        type: 'code',
        language: 'C',
        lines: [
          '// Option byte read sequence (simplified)',
          '#define OPTION_BYTES_BASE 0x1FFFF800',
          '',
          'uint16_t read_rdp_level(void) {',
          '    volatile uint16_t *ob = (uint16_t *)OPTION_BYTES_BASE;',
          '    return (*ob >> 8) & 0xFF; // RDP level in bits [15:8]',
          '}',
        ],
      },
      {
        type: 'heading',
        text: 'Differential Power Analysis',
        icon: 'insights',
      },
      {
        type: 'paragraph',
        text: 'DPA involves collecting thousands of power traces during AES operations and applying statistical correlation to recover the secret key. On a Cortex-M4 without hardware countermeasures, a successful attack typically requires fewer than 10,000 traces. The key insight is that SRAM bus activity creates measurable correlations with intermediate cipher values.',
      },
    ],
  },
  {
    id: 'LOG-001',
    category: 'DEV',
    date: '2024.10.15',
    readTime: '8m',
    title: 'Optimizing Rust Compiles for Embedded Systems',
    description: 'Stripping binary bloat and leveraging link-time optimization (LTO) to squeeze massive Rust binaries onto microcontrollers with less than 64KB of flash memory.',
    relatedIds: ['LOG-004', 'LOG-005'],
    content: [
      {
        type: 'paragraph',
        text: 'Rust\'s zero-cost abstractions come with a hidden cost: compile-time code generation that can balloon binary sizes. On a microcontroller with 64KB of flash, every byte counts. The default release profile with opt-level = "z" and LTO enabled is a good start, but it is rarely sufficient.',
      },
      {
        type: 'heading',
        text: 'LTO and Codegen Units',
        icon: 'memory',
      },
      {
        type: 'code',
        language: 'TOML (Cargo.toml)',
        lines: [
          '[profile.release]',
          'opt-level = "z"       # optimize for size',
          'lto = "fat"           # link-time optimization across all crates',
          'codegen-units = 1     # single codegen unit for maximum optimization',
          'panic = "abort"       # remove unwinding machinery',
          'strip = "symbols"     # strip debug symbols from final binary',
        ],
      },
      {
        type: 'paragraph',
        text: 'Setting codegen-units = 1 forces LLVM to optimize the entire binary as a single compilation unit. Combined with fat LTO, this enables cross-crate inlining and dead code elimination that can reduce binary size by 30–60% compared to the debug profile.',
      },
    ],
  },
  {
    id: 'LOG-002',
    category: 'THEORY',
    date: '2024.09.28',
    readTime: '22m',
    title: 'Non-Euclidean Data Structures in Spatial Computing',
    description: 'An algorithmic approach to mapping complex topologies without relying on standard Cartesian grids. Implications for rendering engines and collision detection in VR environments.',
    relatedIds: ['LOG-005', 'LOG-003'],
    content: [
      {
        type: 'paragraph',
        text: 'Standard R-trees and k-d trees assume Euclidean distance as the primary partitioning metric. When dealing with hyperbolic or spherical spaces — as encountered in physics simulations, certain graph embeddings, and non-Euclidean VR environments — these structures degrade to O(n) worst-case queries.',
      },
      {
        type: 'heading',
        text: 'Gyrovector Spaces as a Framework',
        icon: 'hub',
      },
      {
        type: 'paragraph',
        text: 'Gyrovector spaces, formalized by Abraham Ungar, provide an algebraic framework for hyperbolic geometry analogous to how vector spaces formalize Euclidean geometry. The Möbius addition operation replaces standard vector addition, enabling the construction of spatial indices that preserve the geometry of the underlying space.',
      },
      {
        type: 'heading',
        text: 'Practical Collision Detection',
        icon: 'layers',
      },
      {
        type: 'paragraph',
        text: 'For collision detection in a hyperbolic space rendered on a Poincaré disk, the naive approach of projecting to Euclidean coordinates and back introduces cumulative floating-point errors. Instead, maintaining objects in native gyrovector coordinates and computing geodesic distances directly reduces error accumulation significantly.',
      },
    ],
  },
  {
    id: 'LOG-003',
    category: 'E-ENG',
    date: '2024.09.12',
    readTime: '11m',
    title: 'Acoustic Metamaterials & Signal Dampening',
    description: 'Designing physical structures that manipulate sound waves below sub-wavelength frequencies. Applications in EMI shielding for high-density PCB layouts.',
    relatedIds: ['LOG-FEAT-001', 'LOG-005'],
    content: [
      {
        type: 'paragraph',
        text: 'Acoustic metamaterials are artificially structured composites with properties not found in natural materials. By engineering their sub-wavelength geometry, we can achieve negative bulk modulus, negative mass density, or both simultaneously — properties that enable exotic wave phenomena like acoustic cloaking and perfect absorption.',
      },
      {
        type: 'heading',
        text: 'EMI Shielding via Phononic Bandgap Structures',
        icon: 'signal_cellular_alt',
      },
      {
        type: 'paragraph',
        text: 'The same phononic bandgap principle that blocks acoustic waves in a specific frequency range can be applied to electromagnetic interference. By designing PCB substrate geometries with periodic inclusions at the millimeter scale, it is possible to create stopbands that attenuate RF noise from high-speed switching regulators before it couples into sensitive analog circuits.',
      },
    ],
  },
  {
    id: 'LOG-004',
    category: 'DEV',
    date: '2024.07.20',
    readTime: '13m',
    title: 'Zero-Copy Networking in Linux Kernel Space',
    description: 'Bypassing userspace overhead with io_uring and AF_XDP to build high-frequency data pipelines that route packets at near-wire speed without CPU bottlenecks.',
    relatedIds: ['LOG-001', 'LOG-WIDE-001'],
    content: [
      {
        type: 'paragraph',
        text: 'Traditional networking in Linux copies packet data between kernel and userspace at least twice per packet. At 10Gbps line rates with 64-byte packets, this overhead becomes the bottleneck. AF_XDP bypasses the kernel networking stack entirely by mapping packet buffers directly to userspace memory via a shared UMEM region.',
      },
      {
        type: 'heading',
        text: 'UMEM and Ring Buffer Setup',
        icon: 'developer_board',
      },
      {
        type: 'code',
        language: 'C',
        lines: [
          'struct xsk_umem_config umem_cfg = {',
          '    .fill_size  = XSK_RING_PROD__DEFAULT_NUM_DESCS,',
          '    .comp_size  = XSK_RING_CONS__DEFAULT_NUM_DESCS,',
          '    .frame_size = XSK_UMEM__DEFAULT_FRAME_SIZE,',
          '    .frame_headroom = 0,',
          '    .flags = 0',
          '};',
          '',
          'ret = xsk_umem__create(&umem, buffer, buffer_size,',
          '                        &fill_ring, &comp_ring, &umem_cfg);',
        ],
      },
      {
        type: 'paragraph',
        text: 'With AF_XDP, packets are described by descriptors pointing into the UMEM rather than being copied. The kernel fills the fill ring with empty frame addresses; the application populates the TX ring with frame addresses to transmit. The result is true zero-copy packet processing at the cost of more complex memory management.',
      },
    ],
  },
  {
    id: 'LOG-005',
    category: 'THEORY',
    date: '2024.06.05',
    readTime: '17m',
    title: 'Type Theory Applied to Hardware Description Languages',
    description: 'Exploring how dependent types from Idris and Agda can be applied to VHDL and Verilog to prove circuit correctness at compile time before FPGA synthesis.',
    relatedIds: ['LOG-002', 'LOG-001'],
    content: [
      {
        type: 'paragraph',
        text: 'VHDL and Verilog are weakly typed languages that were designed for simulation before formal verification was a primary concern. A flip-flop output wired to an 8-bit bus is a type error, but both languages will happily synthesize it with a warning. Dependent types change this: a port\'s width becomes part of its type, and mismatches are compile-time errors.',
      },
      {
        type: 'heading',
        text: 'Clash as a Practical Intermediate',
        icon: 'code',
      },
      {
        type: 'paragraph',
        text: 'Clash is a Haskell-based HDL that compiles to synthesizable VHDL/Verilog. Because it uses Haskell\'s type system, bus widths and signal types are fully tracked at compile time. This makes it possible to write generic, polymorphic circuit components that are guaranteed to be type-safe before a single LUT is placed.',
      },
      {
        type: 'code',
        language: 'Haskell (Clash)',
        lines: [
          '-- A type-safe adder: width is a type-level natural number',
          'adder :: KnownNat n',
          '       => Signal System (Unsigned n)',
          '       -> Signal System (Unsigned n)',
          '       -> Signal System (Unsigned n)',
          'adder a b = (+) <$> a <*> b',
          '',
          '-- Width mismatch → compile error, not synthesis warning',
          'bad = adder (signal (3 :: Unsigned 4)) (signal (7 :: Unsigned 8))',
        ],
      },
    ],
  },
  {
    id: 'LOG-WIDE-001',
    category: 'DEV',
    date: '2024.08.30_14:22:00',
    readTime: '6m',
    title: 'Building a Custom RTOS from Scratch',
    description: 'Why rely on FreeRTOS when you can build your own preemptive scheduler? A step-by-step guide to context switching, managing stack frames, and implementing basic mutexes on an ATmega328P.',
    isWide: true,
    relatedIds: ['LOG-001', 'LOG-004'],
    content: [
      {
        type: 'paragraph',
        text: 'A preemptive scheduler on a bare-metal AVR microcontroller requires three primitives: a tick interrupt to drive task switching, a context save/restore mechanism that preserves all CPU registers, and a ready queue to determine which task runs next. Everything else — mutexes, semaphores, message queues — is built on top of these three.',
      },
      {
        type: 'heading',
        text: 'Context Switching on AVR',
        icon: 'swap_horiz',
      },
      {
        type: 'code',
        language: 'AVR Assembly',
        lines: [
          '; Save current task context onto its stack',
          'SAVE_CONTEXT:',
          '    push  r0',
          '    in    r0, SREG     ; save status register',
          '    push  r0',
          '    push  r1',
          '    push  r2',
          '    ; ... push r3–r31 ...',
          '    lds   r26, current_task',
          '    lds   r27, current_task+1',
          '    in    r0, SPL',
          '    st    X+, r0       ; save SP_low to TCB',
          '    in    r0, SPH',
          '    st    X,  r0       ; save SP_high to TCB',
        ],
      },
      {
        type: 'paragraph',
        text: 'The key insight is that each task maintains its own stack. The scheduler\'s context switch simply saves the current SP into the current task\'s TCB, loads the next task\'s SP, and restores its register context. From the task\'s perspective, it resumes exactly where it was suspended.',
      },
    ],
  },
]
