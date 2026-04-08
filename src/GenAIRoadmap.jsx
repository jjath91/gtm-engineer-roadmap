import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

const PHASES = [
  {
    id: 1,
    title: "Math Foundations",
    subtitle: "Just Enough to Read a Paper",
    time: "2–3 weeks",
    icon: "∑",
    color: "#D4915E",
    intro: "You don't need a math degree. You need enough linear algebra, calculus, and probability to follow what's happening inside a neural network. Every equation in a transformer paper uses these same building blocks — once you see the patterns, papers stop being intimidating.",
    sections: [
      {
        name: "Linear Algebra — The Language of Data",
        items: [
          "A vector is a list of numbers. An embedding of the word \"cat\" is a vector — say, 768 numbers that encode its meaning",
          "A matrix is a grid of numbers. A weight matrix transforms one vector into another — this is literally what every layer in a neural network does",
          "Matrix multiplication is the core operation. Input vector × weight matrix = output vector. That's a neural network layer",
          "The dot product measures similarity between two vectors. This is the heart of attention: \"how related is this word to that word?\"",
          "Transpose (flip rows↔columns), inverse, and eigenvalues show up in papers but you can learn them as needed"
        ]
      },
      {
        name: "Calculus — How Models Improve",
        items: [
          "A derivative tells you how much an output changes when you nudge an input. If loss = 5.2 and you slightly change a weight, the derivative tells you whether loss goes up or down",
          "The gradient is just a vector of derivatives — one per weight. It points \"uphill\" in loss landscape. Go the opposite direction to improve",
          "The chain rule lets you compute derivatives through a sequence of operations. This is backpropagation — working backwards through the network to figure out how each weight contributed to the error",
          "Partial derivatives: when you have many variables, take the derivative with respect to one while holding the others fixed. Each weight gets its own partial derivative"
        ]
      },
      {
        name: "Probability & Statistics — The Foundation of Learning",
        items: [
          "A probability distribution assigns likelihood to outcomes. A language model is literally a probability distribution over the next token",
          "Conditional probability: P(next word | previous words) — this is what a language model computes",
          "Bayes' theorem: updating beliefs with evidence. Conceptually important for understanding how models learn from data",
          "Cross-entropy loss: measures how far your model's predicted distribution is from the true distribution. Lower = better predictions. This is THE loss function for language models",
          "Softmax: turns a vector of raw scores into a probability distribution (all positive, sums to 1). Used at the output of every language model"
        ]
      }
    ],
    resources: [
      { name: "3Blue1Brown: Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", note: "Best visual math series ever made — start here" },
      { name: "3Blue1Brown: Essence of Calculus", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", note: "Same quality, covers derivatives and chain rule" },
      { name: "Mathematics for Machine Learning (book)", url: "https://mml-book.github.io/", note: "Free textbook — chapters 2, 5, 6 are what you need" }
    ],
    deeper: "Study information theory (entropy, KL divergence, mutual information) — these concepts appear constantly in ML papers. Cover's \"Elements of Information Theory\" is the classic. For linear algebra depth, Strang's MIT 18.06 lectures are legendary and free on YouTube."
  },
  {
    id: 2,
    title: "Neural Networks",
    subtitle: "From Neurons to Deep Networks",
    time: "2 weeks",
    icon: "⊛",
    color: "#7CAADB",
    intro: "A neural network is a function that takes numbers in and puts numbers out, with millions of adjustable knobs (weights) in between. Training is the process of turning those knobs until the function does something useful. That's it. Everything else is details.",
    sections: [
      {
        name: "The Building Blocks",
        items: [
          "A neuron: takes inputs, multiplies each by a weight, sums them up, adds a bias, passes through an activation function. output = activation(w₁x₁ + w₂x₂ + ... + b)",
          "Activation functions add nonlinearity — without them, stacking layers does nothing (a linear function of a linear function is still linear). ReLU (max(0, x)) is the most common. GELU is used in transformers",
          "A layer: a collection of neurons that all take the same inputs. Represented as a matrix multiplication: output = activation(W·input + b)",
          "A deep network: layers stacked sequentially. Each layer transforms its input and passes the result to the next. Depth lets the network learn hierarchical features"
        ]
      },
      {
        name: "How Information Flows",
        items: [
          "Forward pass: data flows input → layer 1 → layer 2 → ... → output. Each layer applies its weights and activation",
          "The output layer produces predictions. For language models: a probability for every token in the vocabulary (often 50k–200k scores, softmaxed into probabilities)",
          "Parameters = all the weights and biases in the network. GPT-3 has 175B parameters. Frontier models range from tens of billions to over a trillion",
          "Representations / embeddings: the internal state between layers. These vectors capture increasingly abstract features as you go deeper"
        ]
      }
    ],
    code: `# A neural network is just matrix math
import numpy as np

# Single layer: 4 inputs → 3 outputs
W = np.random.randn(3, 4) * 0.01  # weights
b = np.zeros(3)                      # biases

def relu(x):
    return np.maximum(0, x)

def forward(x):
    return relu(W @ x + b)  # matrix multiply + bias + activation

# That's a layer. Stack these and you have a deep network.`,
    resources: [
      { name: "3Blue1Brown: Neural Networks", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", note: "Visual intuition for how networks learn" },
      { name: "Andrej Karpathy: Neural Nets Zero to Hero", url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", note: "Build networks from scratch — the gold standard" },
      { name: "Michael Nielsen: Neural Networks and Deep Learning", url: "http://neuralnetworksanddeeplearning.com/", note: "Free online book, beautifully written" }
    ],
    deeper: "Study convolutional networks (CNNs) and recurrent networks (RNNs/LSTMs) — they came before transformers and the ideas still influence modern architectures. Understanding why RNNs struggled with long sequences is key to appreciating why attention was revolutionary."
  },
  {
    id: 3,
    title: "Learning & Optimization",
    subtitle: "How Models Get Better",
    time: "1–2 weeks",
    icon: "∇",
    color: "#6BC4A6",
    intro: "Training a neural network is an optimization problem: find the weights that minimize the loss function. The algorithm is embarrassingly simple — compute the gradient, take a small step downhill, repeat billions of times. The subtleties are all in how you take that step.",
    sections: [
      {
        name: "The Training Loop",
        items: [
          "1. Forward pass: run input through the network, get a prediction",
          "2. Compute loss: measure how wrong the prediction is (cross-entropy for language models)",
          "3. Backward pass (backpropagation): compute the gradient of the loss with respect to every weight, using the chain rule",
          "4. Update weights: nudge each weight in the direction that reduces loss. w = w - learning_rate × gradient",
          "5. Repeat for the next batch. Do this billions of times"
        ]
      },
      {
        name: "Optimizers",
        items: [
          "SGD (Stochastic Gradient Descent): use a random mini-batch instead of the full dataset. Noisy but fast",
          "Momentum: keep a running average of past gradients. Helps push through flat regions",
          "Adam (Adaptive Moment Estimation): combines momentum with per-parameter learning rates. THE default for transformers. Almost every frontier model uses AdamW (Adam with weight decay)",
          "Learning rate: the step size. Too high → divergence. Too low → forever. Schedules (warmup then cosine decay) are critical for stable training"
        ]
      },
      {
        name: "Training Dynamics",
        items: [
          "Loss curves: plot loss over steps. Should go down smoothly. Spikes = instability. Plateaus = potential issues",
          "Overfitting: model memorizes training data instead of learning patterns. Rare in LLM pre-training (data is huge) but common in fine-tuning",
          "Gradient vanishing/exploding: gradients can shrink to zero or blow up in deep networks. Residual connections and layer norm solve this — both are core to transformers",
          "Batch size: number of examples processed together. Larger = more stable gradients but more memory. Frontier models use batches of millions of tokens"
        ]
      }
    ],
    code: `# The training loop — every ML model uses this pattern
for step in range(num_steps):
    batch = get_next_batch(data)
    predictions = model(batch.inputs)
    loss = cross_entropy(predictions, batch.targets)
    loss.backward()           # backprop
    optimizer.step()          # update weights
    optimizer.zero_grad()     # reset for next step`,
    resources: [
      { name: "Karpathy: Backpropagation lecture (micrograd)", url: "https://www.youtube.com/watch?v=VMj-3S1tku0", note: "Builds backprop from scratch in Python" },
      { name: "Ruder: Overview of Gradient Descent Optimizers", url: "https://ruder.io/optimizing-gradient-descent/", note: "The definitive blog post on optimizers" },
      { name: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/beginner/basics/intro.html", note: "Start coding — PyTorch is what labs use" }
    ],
    deeper: "Study second-order optimization (Newton's method, natural gradient), learning rate finders (Smith's cyclical learning rates), and loss landscape visualization (Li et al., \"Visualizing the Loss Landscape of Neural Nets\")."
  },
  {
    id: 4,
    title: "The Transformer",
    subtitle: "The Architecture That Changed Everything",
    time: "2–3 weeks",
    icon: "⬡",
    color: "#E8C857",
    intro: "The transformer is the architecture behind GPT, Claude, Gemini, Llama, and every frontier language model. Published in 2017's \"Attention Is All You Need,\" it replaced recurrent networks by processing all tokens in parallel using self-attention. If you deeply understand the transformer, you understand the engine of modern AI.",
    sections: [
      {
        name: "Self-Attention — The Core Innovation",
        items: [
          "The problem: how does the model know that in \"The cat sat on the mat because it was tired,\" \"it\" refers to \"cat\"? It needs to look at other positions in the sequence",
          "Every token gets three vectors: Query (Q), Key (K), Value (V), computed by multiplying the token's embedding by three learned weight matrices",
          "Attention scores: dot product of each Query with every Key. \"How much should this token attend to that token?\" Divide by √d for stability, softmax to get weights",
          "Output: attention weights × Values. Each token's output is a weighted combination of all tokens' Values, weighted by relevance",
          "The formula: Attention(Q,K,V) = softmax(QK^T / √d_k) V — this one equation is the heart of modern AI"
        ]
      },
      {
        name: "Multi-Head Attention & The Full Block",
        items: [
          "Multiple heads capture different relationships in parallel — syntax, semantics, coreference. Typical: 32–128 heads",
          "The full block: layer norm → multi-head attention → residual connection → layer norm → feed-forward network (MLP) → residual connection",
          "The feed-forward network: two linear layers with GELU activation. Stores factual knowledge. Takes ~2/3 of parameters",
          "Residual connections: add input to output of each sub-layer. Without these, deep transformers don't train",
          "Stack 32–96 of these blocks and you have a frontier language model"
        ]
      },
      {
        name: "Positional Information",
        items: [
          "Attention is permutation-invariant — doesn't know word order. Must inject position information",
          "Modern standard: RoPE (Rotary Position Embeddings) — encodes relative position in the attention computation. Enables length extrapolation with techniques like YaRN",
          "Grouped Query Attention (GQA): shares key/value heads across query heads. Reduces memory during inference with minimal quality loss. Used by most frontier models"
        ]
      }
    ],
    code: `# Self-attention in ~15 lines
import torch, torch.nn.functional as F

def self_attention(x, W_q, W_k, W_v):
    Q = x @ W_q   # queries
    K = x @ W_k   # keys  
    V = x @ W_v   # values
    d_k = Q.shape[-1]
    scores = Q @ K.transpose(-2, -1) / d_k**0.5
    weights = F.softmax(scores, dim=-1)
    return weights @ V  # weighted sum of values`,
    resources: [
      { name: "\"Attention Is All You Need\"", url: "https://arxiv.org/abs/1706.03762", note: "The original paper — more approachable than you'd expect" },
      { name: "Jay Alammar: The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/", note: "The best visual walkthrough that exists" },
      { name: "Karpathy: Let's build GPT from scratch", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", note: "2 hours, builds a working transformer — essential" },
      { name: "Lilian Weng: The Transformer Family v2", url: "https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/", note: "Comprehensive survey of variants" }
    ],
    deeper: "Study Flash Attention (Dao et al.) — doesn't change the math but makes attention 2-4x faster via IO-aware memory management. Read about the architectural variants: GPT (decoder-only, causal), BERT (encoder-only, bidirectional), T5 (encoder-decoder). Understand why decoder-only won for generative models."
  },
  {
    id: 5,
    title: "Beyond Vanilla Attention",
    subtitle: "MoE, State Space Models & Alternatives",
    time: "1–2 weeks",
    icon: "◈",
    color: "#A0DB7C",
    intro: "The standard transformer has a problem: attention is quadratic in sequence length. Processing 128K tokens means 128K² attention computations. Mixture of Experts rethinks how parameters are used. State space models and linear attention rethink the attention mechanism itself. These aren't fringe ideas — MoE powers most frontier models, and alternatives to attention are among the most active research areas.",
    sections: [
      {
        name: "Mixture of Experts (MoE)",
        items: [
          "The core idea: instead of one large feed-forward network in each transformer block, have multiple \"expert\" FFNs. A learned router decides which experts to activate for each token",
          "Sparse activation: only 2 of 16 experts might fire for any given token. Total parameter count is huge (e.g., Mixtral: 46.7B total, 12.9B active per token). You get the quality of a large model at the inference cost of a smaller one",
          "Switch Transformer (Google, 2021): the paper that made MoE practical for transformers. Routes each token to a single expert. Showed massive training efficiency gains",
          "Mixtral (Mistral, 2023): 8 experts, 2 active per token. Matched or beat GPT-3.5 at much lower inference cost. Made MoE mainstream in open-source",
          "DeepSeek-V2/V3 (2024): innovative MoE with shared experts + routed experts, fine-grained expert segmentation, and multi-head latent attention. Achieved frontier performance at dramatically lower training cost",
          "The routing problem: load balancing across experts is hard. If all tokens go to the same expert, you waste capacity. Auxiliary losses and expert capacity factors help but don't fully solve this",
          "MoE changes everything downstream: serving is harder (must load all experts even though few activate), quantization is trickier, and expert parallelism adds a new distribution axis"
        ]
      },
      {
        name: "State Space Models (SSMs)",
        items: [
          "The insight: instead of attention (which looks at every previous token), model the sequence as a continuous dynamical system with a hidden state. Process tokens recurrently at inference but parallelizably during training",
          "Mamba (Gu & Dao, 2023): the breakthrough SSM. Uses input-dependent (selective) state transitions — the model learns what information to keep and what to forget. Linear-time complexity in sequence length",
          "Mamba-2 and Jamba: hybrid architectures that interleave SSM layers with attention layers. The combination often outperforms pure attention or pure SSM, getting SSM's efficiency with attention's strong in-context learning",
          "RWKV: a linear-complexity architecture that reformulates attention as a recurrent computation. Active open-source community, models up to 14B parameters",
          "The tradeoff: SSMs are faster for long sequences but currently weaker at in-context learning and precise recall compared to attention. The hybrid approach is winning"
        ]
      },
      {
        name: "Other Attention Alternatives",
        items: [
          "Linear attention: approximate softmax attention with kernel methods. O(n) instead of O(n²). Various approaches (Performers, Random Feature Attention) — promising but quality gap persists",
          "Sparse attention: only attend to a subset of positions (local windows, strided patterns, learned patterns). Longformer, BigBird use this. Reduces complexity but loses global context",
          "Ring attention: distribute long sequences across GPUs, each processing a chunk and passing KV cache in a ring. Enables context lengths beyond single-GPU memory"
        ]
      }
    ],
    resources: [
      { name: "\"Outrageously Large Neural Networks\" (MoE)", url: "https://arxiv.org/abs/1701.06538", note: "The foundational Shazeer et al. MoE paper" },
      { name: "\"Mamba: Linear-Time Sequence Modeling\"", url: "https://arxiv.org/abs/2312.00752", note: "The paper that made SSMs competitive" },
      { name: "\"Mixtral of Experts\" technical report", url: "https://arxiv.org/abs/2401.04088", note: "MoE architecture that changed open-source AI" },
      { name: "Sasha Rush: \"The Annotated S4\"", url: "https://srush.github.io/annotated-s4/", note: "Deep walkthrough of state space model foundations" }
    ],
    deeper: "Study the DeepSeek-V3 technical report for the most advanced public MoE design. Read about Hyena (long convolutions as attention replacement), RetNet (Microsoft's retention mechanism), and Griffin (Google's RNN-based alternative). The theoretical question of whether attention is necessary for in-context learning is one of the most interesting open problems — follow the work of researchers like Michael Poli and Tri Dao."
  },
  {
    id: 6,
    title: "Tokenization & Data",
    subtitle: "How Text Becomes Numbers",
    time: "1–2 weeks",
    icon: "◫",
    color: "#C47CDB",
    intro: "A language model never sees text. It sees token IDs — integers that map to chunks of text via a tokenizer. The tokenizer determines what the model can represent and how efficiently. Data is the other half: a model can only be as good as what it trains on — and increasingly, frontier models train on data generated by other models.",
    sections: [
      {
        name: "Tokenization",
        items: [
          "Byte-Pair Encoding (BPE): start with individual characters, repeatedly merge the most frequent pair. \"tokenization\" → [\"token\", \"ization\"]. Common words become single tokens; rare words get split",
          "Vocabulary size tradeoff: larger vocab (100K-200K) = more single-token words but bigger embedding table. Smaller vocab (32K) = more splitting but smaller model",
          "Tokenization is biased: English ≈ 1 token/word, but many languages need 2-5x more tokens. The model is slower, costlier, and has less effective context for non-English text",
          "Numbers and code are hard: \"123456\" might become [\"123\", \"456\"], making arithmetic confusing. Frontier labs experiment with digit-level tokenization"
        ]
      },
      {
        name: "Pre-training Data",
        items: [
          "Scale: frontier models train on 1–15+ trillion tokens. Sources: web crawls (Common Crawl), books, Wikipedia, code (GitHub), papers, forums",
          "Quality > quantity: filtering matters enormously. Removing duplicates, low-quality pages, toxic content, benchmark contamination",
          "Deduplication: exact and near-duplicate removal (MinHash, suffix arrays). Duplicated data wastes compute and causes memorization",
          "Data mixing: the ratio of web/books/code/math significantly affects capabilities. More code → better reasoning. The exact mix is closely guarded at frontier labs"
        ]
      },
      {
        name: "Synthetic Data — The New Frontier",
        items: [
          "Using stronger models to generate training data for new or smaller models. Most frontier post-training already relies heavily on synthetic data",
          "Distillation data: have GPT-4/Claude generate high-quality responses, train a smaller model on them. The Alpaca/Vicuna approach, now done at massive scale",
          "Self-play and self-improvement: model generates solutions, verifies them (especially for math/code where verification is tractable), trains on the correct ones",
          "Synthetic reasoning chains: generate step-by-step reasoning traces, filter for correctness, use as training data. Key technique behind o1-style reasoning models",
          "The quality ceiling: a model trained purely on synthetic data from model X probably can't exceed model X's capability (with exceptions when verification is available). This is an active research question",
          "Data contamination risk: synthetic data can inadvertently encode benchmark answers from the generating model's training data"
        ]
      }
    ],
    resources: [
      { name: "Karpathy: Let's build the GPT Tokenizer", url: "https://www.youtube.com/watch?v=zduSFxRajkE", note: "Builds BPE from scratch — essential" },
      { name: "\"Textbooks Are All You Need\" (Phi-1)", url: "https://arxiv.org/abs/2306.11644", note: "Microsoft's case for synthetic/curated data over scale" },
      { name: "\"Dolma\" paper (AI2)", url: "https://arxiv.org/abs/2402.00159", note: "Modern open data curation pipeline" },
      { name: "\"Self-Instruct\" paper", url: "https://arxiv.org/abs/2212.10560", note: "Foundational paper on using LLMs to generate training data" }
    ],
    deeper: "Read about data governance and the legal landscape (NYT vs OpenAI, Getty vs Stability AI). Study the FineWeb dataset and its curation process. Explore alternative tokenization: character-level models (ByT5), pixel-level models, and the MegaByte paper on tokenization-free architectures."
  },
  {
    id: 7,
    title: "Pre-training",
    subtitle: "Teaching a Model to Predict",
    time: "2 weeks",
    icon: "◌",
    color: "#DB7C7C",
    intro: "Pre-training is where a model learns language by predicting the next token, billions of times. The objective is deceptively simple — predict what comes next — but the emergent capabilities are extraordinary. A model that predicts well must understand grammar, facts, reasoning, code, math, and more.",
    sections: [
      {
        name: "The Pre-training Objective",
        items: [
          "Causal Language Modeling (CLM): given tokens [t₁, t₂, ..., tₙ], predict tₙ₊₁. The model only looks left (causal masking). This is what GPT, Claude, Llama, and most frontier models use",
          "Why it works: to predict well, the model must develop internal representations of syntax, semantics, world knowledge, and reasoning. The prediction task is simple; the capability it requires is not",
          "Alternative objectives: Masked Language Modeling (BERT), prefix LM (T5), denoising. CLM dominates for generative models because it naturally produces text left-to-right"
        ]
      },
      {
        name: "Training Recipes",
        items: [
          "Context length: tokens processed at once. Now 8K–128K+ at frontier. Longer context = quadratically more attention cost (Flash Attention helps)",
          "Learning rate schedule: linear warmup (1K–5K steps) then cosine decay. Peak learning rate and warmup duration are critical hyperparameters",
          "Mixed precision: bfloat16 instead of float32. Halves memory, doubles speed, minimal quality loss. Now standard",
          "Gradient checkpointing: recompute intermediate activations during backward pass instead of storing them. Trade compute for memory"
        ]
      },
      {
        name: "What Happens During Training",
        items: [
          "Phase transitions: capabilities emerge non-linearly. Models can suddenly acquire abilities at certain training points or scales. Still poorly understood",
          "Training instabilities: loss spikes from bad data, learning rate issues, or numerical instability. Labs have protocols for rollback and data skipping",
          "Checkpoint averaging: averaging weights from multiple checkpoints often produces a better model than any single checkpoint"
        ]
      }
    ],
    resources: [
      { name: "Karpathy: nanoGPT", url: "https://github.com/karpathy/nanoGPT", note: "Minimal GPT you can train yourself" },
      { name: "\"Language Models are Few-Shot Learners\" (GPT-3)", url: "https://arxiv.org/abs/2005.14165", note: "Scale → capabilities" },
      { name: "Llama 2 paper", url: "https://arxiv.org/abs/2307.09288", note: "Unusually transparent training recipe from Meta" },
      { name: "OLMo paper (AI2)", url: "https://arxiv.org/abs/2402.00838", note: "Most transparent frontier-class training run documented" }
    ],
    deeper: "Study curriculum learning, the warmup-stable-decay (WSD) schedule, and training on multiple epochs. Read the Llama 3 paper for Meta's perspective on pushing data scaling past Chinchilla optimal."
  },
  {
    id: 8,
    title: "Scaling Laws & Compute",
    subtitle: "Why Bigger Works — And the Test-Time Revolution",
    time: "1–2 weeks",
    icon: "⊿",
    color: "#E8A857",
    intro: "Scaling laws predict how performance improves with compute, parameters, and data. They've guided billions in investment decisions. But 2024-25 revealed a second axis of scaling: test-time compute. Instead of just making models bigger, you can make them think longer. This changes the game.",
    sections: [
      {
        name: "Training-Time Scaling Laws",
        items: [
          "Kaplan et al. (OpenAI, 2020): loss scales as a power law with model size, dataset size, and compute. Larger models are more sample-efficient",
          "Chinchilla (DeepMind, 2022): for a fixed compute budget, there's an optimal model-size-to-data ratio. Most models were undertrained — train on ~20x tokens as parameters",
          "Post-Chinchilla: for inference-optimized models, \"overtrain\" — use even more data than Chinchilla-optimal to get the best small model possible. Llama 3 8B trained on 15T tokens",
          "Compute: GPT-4 training estimated ~2×10²⁵ FLOPs (~$100M+). 2025-26 frontier runs likely cost $500M–$1B+"
        ]
      },
      {
        name: "Test-Time Compute — The New Scaling Axis",
        items: [
          "The insight: instead of only scaling pre-training compute, let the model use more compute at inference time by \"thinking\" before answering. This is what o1-style reasoning models do",
          "Chain-of-thought at scale: the model generates long internal reasoning chains (sometimes hundreds of tokens) before producing an answer. More thinking tokens = better answers on hard problems",
          "Reinforcement Learning for Verified Reasoning (RLVR): train the model with RL where the reward signal is whether the final answer is correct (verifiable in math, code, etc.). The model learns to generate useful reasoning steps",
          "Process reward models (PRMs): reward each step of reasoning, not just the final answer. Enables credit assignment — which reasoning step helped or hurt?",
          "Best-of-N sampling: generate multiple answers, use a verifier to pick the best one. Simple but effective — trading inference compute for quality",
          "The new scaling law: performance improves as a power law of test-time compute, partially independent of model size. A smaller model thinking longer can outperform a larger model answering immediately",
          "Implications: the optimal strategy may be to train a smaller-but-smarter model and give it more thinking time, rather than training the largest possible model. This is reshaping how labs allocate compute"
        ]
      },
      {
        name: "What Scales and What Doesn't",
        items: [
          "Reliably improves: language fluency, factual knowledge, code, translation, in-context learning, reasoning (with test-time compute)",
          "Emergent behavior: some abilities appear suddenly at certain scales. Whether this is real or measurement artifact is debated (Schaeffer et al.)",
          "Struggles to scale: precise arithmetic, reliable counting, spatial reasoning, consistent long-horizon planning. May need architectural changes, not just scale"
        ]
      }
    ],
    resources: [
      { name: "\"Scaling Laws for Neural Language Models\"", url: "https://arxiv.org/abs/2001.08361", note: "Original OpenAI scaling laws" },
      { name: "\"Training Compute-Optimal LLMs\" (Chinchilla)", url: "https://arxiv.org/abs/2203.15556", note: "Changed training strategy industry-wide" },
      { name: "\"Scaling LLM Test-Time Compute\" (Snell et al.)", url: "https://arxiv.org/abs/2408.03314", note: "The theoretical framework for test-time scaling" },
      { name: "Sutton: \"The Bitter Lesson\"", url: "http://www.incompleteideas.net/IncIdea/BitterLesson.html", note: "Short, profound essay on the history of AI" }
    ],
    deeper: "Study the DeepSeek-R1 paper for an open approach to reasoning models. Read about the relationship between pre-training loss and downstream benchmarks, and how scaling laws change with MoE architectures. The debate between \"scale is all you need\" and \"we need new ideas\" is the central tension in the field."
  },
  {
    id: 9,
    title: "Distributed Training",
    subtitle: "Making the Impossible Possible",
    time: "1–2 weeks",
    icon: "⬢",
    color: "#7CD4B8",
    intro: "A frontier model doesn't fit on one GPU — or eight. Training requires thousands of GPUs working in concert for months. Distributed training is where the hardest systems engineering in AI happens.",
    sections: [
      {
        name: "Why Distributed",
        items: [
          "An H100 has 80GB memory. A 70B model in float16 needs ~140GB for weights alone. Add optimizer states (Adam stores 2 extra copies) → ~1TB. That's 12+ GPUs just to hold the model",
          "GPU-to-GPU communication often becomes the bottleneck, not computation"
        ]
      },
      {
        name: "Parallelism Strategies",
        items: [
          "Data Parallelism (DP): each GPU has the full model, processes different data, averages gradients. Simple but model must fit on one GPU",
          "Tensor Parallelism (TP): split individual layers across GPUs. Requires fast NVLink interconnect. Typically within a single node (8 GPUs)",
          "Pipeline Parallelism (PP): different layers on different GPUs. Micro-batching reduces idle \"bubbles\"",
          "Fully Sharded Data Parallel (FSDP / ZeRO): shard weights, gradients, and optimizer states. Each GPU stores 1/N of the model. Most memory-efficient",
          "Expert Parallelism (EP): for MoE models, different experts on different GPUs. Adds a fourth dimension to distribution",
          "3D/4D parallelism: frontier labs combine TP + PP + FSDP + EP. The interaction between strategies requires careful tuning"
        ]
      },
      {
        name: "Engineering Challenges",
        items: [
          "Failure recovery: 4,000 GPUs for 3 months = guaranteed hardware failures. Automatic checkpointing and restart is essential",
          "Network topology: physical GPU arrangement determines which strategies work. NVLink within node, InfiniBand across nodes",
          "Reproducibility: floating-point distributed ops aren't perfectly deterministic. Bit-exact reproducibility is extremely hard"
        ]
      }
    ],
    resources: [
      { name: "Lilian Weng: Large Transformer Training", url: "https://lilianweng.github.io/posts/2021-09-25-train-large/", note: "Comprehensive parallelism overview" },
      { name: "DeepSpeed documentation", url: "https://www.deepspeed.ai/", note: "Microsoft's distributed training library" },
      { name: "Megatron-LM paper", url: "https://arxiv.org/abs/1909.08053", note: "NVIDIA's large-scale training framework" }
    ],
    deeper: "Read the OPT-175B logbook for the day-to-day reality of large training runs. Study the hardware: NVIDIA DGX, Google TPU pods, custom silicon. Learn about the networking stack (NCCL, RDMA) and why InfiniBand bandwidth matters so much."
  },
  {
    id: 10,
    title: "Fine-Tuning & Adaptation",
    subtitle: "LoRA, QLoRA & Parameter-Efficient Methods",
    time: "1 week",
    icon: "◐",
    color: "#DB9A7C",
    intro: "Full fine-tuning updates every parameter in the model — expensive and often impractical. Parameter-efficient fine-tuning (PEFT) methods let you adapt a large model by updating a tiny fraction of parameters. LoRA is by far the most important: it's how most practitioners actually fine-tune models in 2025-26.",
    sections: [
      {
        name: "Why Not Full Fine-Tuning?",
        items: [
          "A 70B model requires hundreds of GB of GPU memory for full fine-tuning (weights + gradients + optimizer states). Most organizations can't afford this",
          "Full fine-tuning risks catastrophic forgetting: the model loses general capabilities while learning the new task",
          "You often need to serve multiple fine-tuned variants. Storing a full copy of a 70B model per customer is impractical. PEFT methods produce small adapter files that can be hot-swapped"
        ]
      },
      {
        name: "LoRA — Low-Rank Adaptation",
        items: [
          "The insight: the weight updates during fine-tuning have low intrinsic rank. Instead of updating a full d×d weight matrix, decompose the update into two small matrices: A (d×r) and B (r×d) where r << d (typically 8–64)",
          "During fine-tuning: freeze all original weights. Only train the LoRA matrices A and B. This reduces trainable parameters by 100–1000x",
          "During inference: merge LoRA weights into the base model (W_new = W + BA). Zero additional latency compared to the original model",
          "LoRA works shockingly well: for most fine-tuning tasks, LoRA matches or nearly matches full fine-tuning quality at a fraction of the cost",
          "Rank (r) selection: higher rank = more capacity but more parameters. r=8 works for simple tasks, r=64 for complex ones. This is a key hyperparameter",
          "Which layers to adapt: typically applied to attention projection matrices (Q, K, V, O). Some practitioners also adapt the MLP layers"
        ]
      },
      {
        name: "QLoRA & Beyond",
        items: [
          "QLoRA: quantize the base model to 4-bit, then apply LoRA on top. Fine-tune a 65B model on a single 48GB GPU. Enabled by NormalFloat4 quantization and double quantization",
          "DoRA (Weight-Decomposed LoRA): decomposes weight updates into magnitude and direction components. Often outperforms standard LoRA",
          "Adapters: small bottleneck layers inserted between transformer blocks. The original PEFT method but largely superseded by LoRA",
          "Prefix tuning / prompt tuning: learn soft prompts (continuous embedding vectors) that are prepended to the input. No weight modification at all. Simple but limited capacity",
          "Continued pre-training: sometimes you want to inject new domain knowledge (legal, medical, financial) before fine-tuning on tasks. This is a middle ground between pre-training and fine-tuning, often using full or LoRA-based training on domain-specific corpora"
        ]
      }
    ],
    code: `# LoRA in practice with Hugging Face PEFT
from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=16,                        # rank
    lora_alpha=32,               # scaling factor
    target_modules=["q_proj", "v_proj"],  # which layers
    lora_dropout=0.05,
    task_type="CAUSAL_LM"
)

model = get_peft_model(base_model, config)
# trainable params: ~0.1% of total
model.print_trainable_parameters()`,
    resources: [
      { name: "\"LoRA: Low-Rank Adaptation of LLMs\"", url: "https://arxiv.org/abs/2106.09685", note: "The foundational paper — clean and practical" },
      { name: "\"QLoRA\" paper", url: "https://arxiv.org/abs/2305.14314", note: "Fine-tune 65B on one GPU" },
      { name: "Hugging Face PEFT library", url: "https://huggingface.co/docs/peft", note: "Practical implementation of all PEFT methods" },
      { name: "Sebastian Raschka: LoRA practical guide", url: "https://magazine.sebastianraschka.com/p/practical-tips-for-finetuning-llms", note: "Hands-on tips from extensive experimentation" }
    ],
    deeper: "Study model merging — combining multiple LoRA adapters or fine-tuned models into one (TIES, DARE, model soups). Read about RLHF with LoRA (it works but requires care with the reference model). Explore the theory of why low-rank updates work: the intrinsic dimensionality hypothesis suggests neural networks live on low-dimensional submanifolds of parameter space."
  },
  {
    id: 11,
    title: "Post-Training Alignment",
    subtitle: "From Base Model to Aligned Assistant",
    time: "2 weeks",
    icon: "◍",
    color: "#E8927C",
    intro: "A pre-trained model predicts text but doesn't follow instructions, answer helpfully, or refuse harm. Post-training transforms a raw base model into an aligned assistant. This is where the science gets hardest and the stakes get highest.",
    sections: [
      {
        name: "Supervised Fine-Tuning (SFT)",
        items: [
          "Collect (instruction, response) pairs from human annotators or AI-generated data. Fine-tune with the same next-token objective",
          "SFT teaches format: how to respond, follow instructions, structure outputs. Data quality dominates quantity — 10K excellent examples often beats millions of mediocre ones (the LIMA finding)",
          "Multi-turn conversation data is essential — the model needs coherent dialogue, not just single-turn Q&A"
        ]
      },
      {
        name: "RLHF — Reinforcement Learning from Human Feedback",
        items: [
          "1. Train a reward model: humans compare response pairs, a model learns to predict preferences",
          "2. RL optimization (PPO): tune the LLM to produce outputs the reward model scores highly",
          "3. KL penalty: prevent drifting too far from SFT model (avoids reward hacking)",
          "Constitutional AI (Anthropic): define principles, have AI evaluate responses against them. RLAIF = RL from AI Feedback. Scales better than pure human feedback"
        ]
      },
      {
        name: "DPO & Alternatives",
        items: [
          "Direct Preference Optimization (DPO): skip the reward model. Directly optimize on preference pairs via mathematical reformulation. Simpler, more stable, widely adopted",
          "Iterative / online DPO: generate new completions, get preferences, retrain. This feedback loop enables improvement beyond initial preference data",
          "RLHF vs DPO: RLHF may generalize better at frontier; DPO is simpler and more stable. Labs experiment with both and hybrids"
        ]
      },
      {
        name: "Reasoning Models",
        items: [
          "o1-style reasoning: train the model to use extended \"thinking\" before answering. RL on reasoning chains verified against ground truth",
          "RLVR (RL with Verified Reasoning): reward correctness of final answer (math/code where verification is tractable). The model discovers useful reasoning strategies through RL",
          "Process reward models: reward each reasoning step, not just final answer. Better credit assignment for multi-step problems",
          "This represents a paradigm shift: instead of only improving models through better pre-training, you can improve them through better inference-time reasoning"
        ]
      }
    ],
    resources: [
      { name: "\"Training LMs to Follow Instructions\" (InstructGPT)", url: "https://arxiv.org/abs/2203.02155", note: "Introduced RLHF for LLMs" },
      { name: "\"Direct Preference Optimization\" (DPO)", url: "https://arxiv.org/abs/2305.18290", note: "The simpler RLHF alternative" },
      { name: "Anthropic's Constitutional AI", url: "https://arxiv.org/abs/2212.08073", note: "Principle-based alignment" },
      { name: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2401.12954", note: "Open reasoning model with detailed training methodology" }
    ],
    deeper: "Study reward hacking and Goodhart's Law in LLMs. Read Anthropic's \"Sleeper Agents\" on limits of safety training. Explore SPIN (Self-Play Fine-Tuning), debate as alignment, and the theory of iterative self-improvement."
  },
  {
    id: 12,
    title: "Prompt Engineering & ICL",
    subtitle: "The Science of Talking to Models",
    time: "1 week",
    icon: "❯",
    color: "#7CE8C6",
    intro: "In-context learning is one of the most surprising capabilities of large language models: they can learn to perform new tasks from examples provided in the prompt, without any gradient updates. Prompt engineering is the practical discipline of exploiting this. It's both a valuable hands-on skill and a deep theoretical puzzle.",
    sections: [
      {
        name: "In-Context Learning — Why It Works",
        items: [
          "Zero-shot: give the model an instruction with no examples. \"Translate to French: 'Hello'\" → works because pre-training included translation",
          "Few-shot: provide examples in the prompt. The model infers the pattern and applies it. GPT-3 showed this scales reliably with model size",
          "The mechanism: induction heads — attention circuits that implement pattern matching. When the model sees A→B in the examples and then sees A again, induction heads predict B. This is an actual circuit discovered via mechanistic interpretability (Olsson et al.)",
          "In-context learning ≠ fine-tuning: no weights change. The model uses its existing capabilities to pattern-match from examples. But the effect can look remarkably similar to having been trained on those examples",
          "Task vectors: recent research suggests ICL works by shifting the model's internal representations toward a \"task vector\" in activation space. This connects prompt engineering to representation engineering"
        ]
      },
      {
        name: "Chain-of-Thought & Reasoning Prompts",
        items: [
          "Chain-of-thought (CoT): ask the model to reason step by step before answering. \"Let's think step by step\" dramatically improves performance on math, logic, and complex reasoning tasks",
          "Why CoT works: it decomposes hard problems into easier sub-problems, each within the model's capability. It also provides intermediate variables the model can reference",
          "Self-consistency: generate multiple CoT reasoning chains, take the majority vote on the final answer. More expensive but significantly more reliable",
          "Tree-of-thought: explore multiple reasoning paths, evaluate them, backtrack and try alternatives. Structured search over reasoning strategies",
          "Prompt chaining: break complex tasks into sequential stages, where each prompt uses the output of the previous one. The basis of many agent architectures"
        ]
      },
      {
        name: "System Prompts & Practical Techniques",
        items: [
          "System prompts set the model's persona, constraints, and behavior. They're processed as part of the context but given special treatment in the attention pattern by most models",
          "Structured output: instruct the model to respond in JSON, XML, or specific formats. Combined with constrained decoding (grammar-guided generation), you can guarantee valid output structure",
          "Role prompting: assigning the model a specific expert role (\"You are a senior security engineer\") can improve domain-specific responses by activating relevant knowledge patterns",
          "Negative prompting: specifying what NOT to do is often as important as what to do. \"Don't include caveats\" or \"Don't start with 'I'd be happy to'\"",
          "The meta-skill: understanding what's in the model's capabilities vs. what requires external tools. The best prompt engineers know when to stop prompting and start building"
        ]
      }
    ],
    resources: [
      { name: "\"Chain-of-Thought Prompting\" (Wei et al.)", url: "https://arxiv.org/abs/2201.11903", note: "The paper that changed how we use LLMs" },
      { name: "\"In-context Learning and Induction Heads\" (Olsson et al.)", url: "https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/", note: "Why ICL works mechanistically" },
      { name: "Anthropic's Prompt Engineering docs", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", note: "Practical, production-grade guidance" },
      { name: "\"Language Models are Few-Shot Learners\" (GPT-3)", url: "https://arxiv.org/abs/2005.14165", note: "The paper that demonstrated ICL at scale" }
    ],
    deeper: "Study the theory of why in-context learning works: the connection to gradient descent in function space (Akyürek et al., von Oswald et al.), the role of pre-training data distribution, and whether ICL is \"real\" learning or sophisticated retrieval. Read about prompt injection and jailbreaking as adversarial prompt engineering — understanding attacks is essential for defense."
  },
  {
    id: 13,
    title: "RAG, Agents & Tool Use",
    subtitle: "Models That Retrieve, Reason & Act",
    time: "2 weeks",
    icon: "⟐",
    color: "#D4A843",
    intro: "A standalone language model has a fixed knowledge cutoff and can only produce text. The agentic paradigm extends LLMs with retrieval (access to external knowledge), tool use (ability to call APIs and run code), and planning (multi-step reasoning toward goals). This is where most professional GenAI work is heading in 2025-26.",
    sections: [
      {
        name: "Retrieval-Augmented Generation (RAG)",
        items: [
          "The problem: LLMs have stale knowledge, hallucinate facts, and can't access your private data. RAG solves this by retrieving relevant documents and including them in the prompt",
          "Basic RAG pipeline: (1) chunk your documents, (2) embed each chunk into a vector using an embedding model, (3) store vectors in a vector database, (4) at query time, embed the question, find the most similar chunks, (5) include those chunks in the prompt as context",
          "Embedding models: map text to dense vectors where semantic similarity = vector proximity. Models like text-embedding-3 (OpenAI), Voyage, or open-source alternatives (e5, bge) produce 768-3072 dimensional vectors",
          "Vector databases: Pinecone, Weaviate, Chroma, Qdrant, pgvector. Store embeddings and enable fast nearest-neighbor search. The choice matters less than your chunking and embedding strategy",
          "Chunking strategy: how you split documents dramatically affects retrieval quality. Too small → missing context. Too large → diluted relevance. Sentence-window, parent-document, and semantic chunking are common approaches",
          "Advanced RAG: re-ranking retrieved results with a cross-encoder, hybrid search (combining semantic + keyword/BM25 search), query decomposition (breaking complex questions into sub-queries), and HyDE (generating a hypothetical answer to improve retrieval)"
        ]
      },
      {
        name: "Tool Use & Function Calling",
        items: [
          "Function calling: the model outputs structured JSON indicating which function to call with what arguments. The application executes the function and returns results to the model",
          "Training for tool use: models learn function calling through SFT on tool-augmented conversations and sometimes RL with tool-use rewards",
          "Common tool patterns: web search, code execution (Python REPL), database queries, API calls, file manipulation, calculator. The model learns when to use each tool",
          "MCP (Model Context Protocol): Anthropic's open standard for connecting models to external tools and data sources. Provides a universal interface so tools work across models and applications",
          "Constrained generation: ensure the model's tool call output is valid JSON matching a specific schema. Grammar-guided decoding guarantees syntactic correctness"
        ]
      },
      {
        name: "Agent Architectures",
        items: [
          "ReAct (Reason + Act): the model alternates between reasoning steps (\"I need to find...\") and actions (search, calculate, look up). The reasoning trace guides tool selection",
          "Planning: decompose a complex goal into sub-tasks, execute them in order, adapt the plan based on intermediate results. Approaches range from simple prompt chaining to tree search",
          "Memory systems: short-term (conversation context), medium-term (scratchpads, retrieval from current session), long-term (persistent storage across sessions). Each requires different architecture",
          "Multi-agent systems: multiple LLM instances with different roles collaborating on a task. Patterns: debate (agents critique each other), delegation (manager assigns tasks to specialists), ensemble (multiple agents attempt the same task, vote on results)",
          "Agent frameworks: LangChain and LlamaIndex are the dominant ecosystems. LangGraph enables stateful, multi-step agent workflows with explicit graph-based control flow. CrewAI focuses on multi-agent orchestration",
          "The reliability problem: agents compound errors. If each step has 90% success rate, a 10-step plan succeeds only 35% of the time. This is the fundamental challenge — making agents robust enough for production"
        ]
      },
      {
        name: "Multimodal Agents",
        items: [
          "Vision + tools: agents that can see screenshots, navigate web pages, fill forms, and interact with GUIs. Computer use is an emerging capability",
          "Code agents: write and execute code as their primary tool. Can iterate — run code, see errors, fix them, retry. Increasingly powerful for data analysis and engineering tasks",
          "The frontier: agents that can operate autonomously for extended periods, maintain coherent state, recover from errors, and ask for help when needed. Still early but progressing rapidly"
        ]
      }
    ],
    code: `# Basic RAG pipeline
from openai import OpenAI
import chromadb

# 1. Index documents
collection = chromadb.Client().create_collection("docs")
for doc in documents:
    embedding = embed(doc.text)
    collection.add(ids=[doc.id], embeddings=[embedding],
                   documents=[doc.text])

# 2. At query time: retrieve + generate
query_embedding = embed(user_question)
results = collection.query(query_embeddings=[query_embedding], n_results=5)

response = client.chat.completions.create(
    model="claude-sonnet-4-20250514",
    messages=[{
        "role": "user",
        "content": f"Context: {results['documents']}\\n\\nQ: {user_question}"
    }]
)`,
    resources: [
      { name: "\"ReAct: Synergizing Reasoning and Acting\"", url: "https://arxiv.org/abs/2210.03629", note: "The foundational agent pattern" },
      { name: "\"Retrieval-Augmented Generation\" (Lewis et al.)", url: "https://arxiv.org/abs/2005.11401", note: "The original RAG paper" },
      { name: "LangChain docs", url: "https://python.langchain.com/docs/get_started/introduction", note: "The dominant agent/RAG framework" },
      { name: "LlamaIndex docs", url: "https://docs.llamaindex.ai/", note: "Data framework for LLM applications — strong on RAG" },
      { name: "Anthropic tool use docs", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", note: "Production-grade function calling" }
    ],
    deeper: "Read about Voyager (LLM agent in Minecraft that builds its own library of skills), SWE-Agent (automated software engineering), and the Gorilla paper on LLMs for API calling. Study the theoretical limits of agents: when does an agent strategy provably outperform a single-pass model? The METR evaluations of autonomous capabilities are essential reading for understanding where agents are heading."
  },
  {
    id: 14,
    title: "Evaluation",
    subtitle: "Measuring What Models Can Do",
    time: "1 week",
    icon: "⊡",
    color: "#7CE8E8",
    intro: "Evaluation is one of the hardest unsolved problems in AI. Benchmarks saturate, human evaluation is expensive, and models increasingly game metrics. Frontier labs spend enormous effort here — and increasingly use LLMs themselves as judges.",
    sections: [
      {
        name: "Benchmark Landscape",
        items: [
          "MMLU: 57 subjects, multiple choice. Most-cited but saturating — frontier models score 85-90%+",
          "HumanEval / SWE-Bench: code generation. SWE-Bench tests on real GitHub issues — closer to actual engineering work",
          "GSM8K / MATH / AIME: math reasoning at increasing difficulty. Competition math (AIME, IMO problems) is the current frontier",
          "GPQA: PhD-level science questions. Hard for non-experts, answerable by experts",
          "ARC-AGI: fluid intelligence / pattern recognition. Designed to resist LLM pattern matching",
          "Chatbot Arena (LMSYS): humans compare two anonymous models and vote. Elo ratings. Closest to real-world performance"
        ]
      },
      {
        name: "LLM-as-Judge & Production Evaluation",
        items: [
          "LLM-as-Judge: use a strong model (GPT-4, Claude) to evaluate outputs from other models. Scales much better than human evaluation. Correlates reasonably well with human preferences",
          "G-Eval: use chain-of-thought prompting for the judge model to produce evaluation scores. More reliable than simple \"rate this 1-5\" prompting",
          "Pairwise comparison: have the judge compare two outputs rather than rate one absolutely. More consistent, less sensitive to prompt variations",
          "Limitations: LLM judges have biases — verbosity bias (prefer longer answers), position bias (prefer the first option), self-enhancement bias (prefer outputs from their own model family). Calibration is essential",
          "Regression testing: when you update a model or prompt, automatically run evaluation on a held-out test set. Catch regressions before deployment",
          "A/B testing: the ultimate evaluation. Show real users both versions, measure preference, engagement, and task completion. Frontier labs run extensive A/B tests"
        ]
      },
      {
        name: "Why Evaluation Is Hard",
        items: [
          "Contamination: benchmark questions in training data → meaningless scores. Nearly impossible to guarantee with web-scraped data",
          "Saturation: benchmarks become too easy. MMLU went from impressive to routine in ~2 years. Arms race for harder benchmarks",
          "Goodhart's Law: optimizing for benchmark scores diverges from actual capability. When a measure becomes a target, it ceases to be a good measure",
          "Open-ended evaluation: for creative writing or nuanced analysis, there's no ground truth. Human eval is gold standard but subjective and expensive"
        ]
      }
    ],
    resources: [
      { name: "LMSYS Chatbot Arena", url: "https://lmarena.ai/", note: "Live human preference rankings" },
      { name: "\"Judging LLM-as-Judge\" (Zheng et al.)", url: "https://arxiv.org/abs/2306.05685", note: "The MT-Bench paper establishing LLM-as-judge methodology" },
      { name: "HELM (Stanford)", url: "https://arxiv.org/abs/2211.09110", note: "Comprehensive evaluation framework" },
      { name: "\"Are Emergent Abilities a Mirage?\" (Schaeffer et al.)", url: "https://arxiv.org/abs/2304.15004", note: "Provocative re-examination of emergence claims" }
    ],
    deeper: "Study evaluation design: construct validity, item response theory, and why psychometrics matters for AI evaluation. Read about METR's evaluations of autonomous AI capabilities, behavioral testing (CheckList), and the challenge of evaluating safety properties (how do you prove a model won't help with bioweapons?)."
  },
  {
    id: 15,
    title: "Inference & Serving",
    subtitle: "Fast, Cheap, and Everywhere",
    time: "1–2 weeks",
    icon: "▹",
    color: "#AADB7C",
    intro: "Training is a one-time cost. Serving to millions of users is ongoing and can dwarf training costs. Inference optimization makes models faster and cheaper — and increasingly, it's about running models not just in data centers but on phones, laptops, and edge devices.",
    sections: [
      {
        name: "How Inference Works",
        items: [
          "Autoregressive generation: one token at a time, each requiring a forward pass. 1000 tokens = 1000 sequential passes — inherently serial",
          "Prefill vs. decode: processing the input (prefill) is parallel and fast. Generating output (decode) is sequential and slow",
          "KV Cache: cache Key/Value vectors from previous tokens. Memory-intensive but essential for speed",
          "TTFT vs. throughput: Time to First Token matters for user experience. Tokens/second matters for cost. Different optimizations target each"
        ]
      },
      {
        name: "Optimization Techniques",
        items: [
          "Quantization: fewer bits per weight. INT8 ≈ 2x speedup, minimal quality loss. INT4 ≈ 4x but quality degrades. Methods: GPTQ, AWQ, GGUF",
          "Speculative decoding: draft model predicts multiple tokens, large model verifies in parallel. When draft is right, you get multiple tokens cheaply",
          "Continuous batching: dynamically add/remove requests instead of waiting for all to finish. Eliminates wasted compute from padding",
          "Paged attention (vLLM): manages KV cache like virtual memory. Huge throughput improvement",
          "Model distillation: train a small model to mimic a large one using its output distributions. Better small model than training from scratch"
        ]
      },
      {
        name: "Edge & On-Device Deployment",
        items: [
          "The push: Apple Intelligence, Llama on-device, Gemini Nano. Run models locally for privacy, latency, and offline use",
          "Extreme quantization: 2-bit and 1.58-bit (ternary) models. BitNet and similar research shows surprisingly good quality at extreme compression",
          "Architecture design for edge: smaller models specifically designed for constrained environments. Phi, Gemma, SmolLM are built for this",
          "Hybrid inference: use a small on-device model for simple tasks, route complex queries to cloud. The routing decision itself can be a small classifier",
          "Frameworks: llama.cpp (CPU inference), MLX (Apple Silicon), ExecuTorch (mobile). Each optimized for specific hardware"
        ]
      },
      {
        name: "Serving Infrastructure",
        items: [
          "vLLM: most popular open-source engine. Paged attention + continuous batching",
          "TensorRT-LLM: NVIDIA-optimized inference. Aggressive kernel fusion",
          "SGLang: emerging framework focused on structured generation and complex LLM programs",
          "Cost: a 70B model serving 1M requests/day = $10K-50K/day in compute. Quantization and distillation are economic necessities"
        ]
      }
    ],
    resources: [
      { name: "vLLM paper (paged attention)", url: "https://arxiv.org/abs/2309.06180", note: "The inference engine that changed serving" },
      { name: "\"Speculative Decoding\" (Leviathan et al.)", url: "https://arxiv.org/abs/2211.17192", note: "Clever parallel generation" },
      { name: "llama.cpp", url: "https://github.com/ggerganov/llama.cpp", note: "The project that proved LLMs can run on CPUs" },
      { name: "\"The Era of 1-bit LLMs\" (BitNet)", url: "https://arxiv.org/abs/2402.17764", note: "Extreme quantization that actually works" }
    ],
    deeper: "Study CUDA programming and GPU architecture (SMs, memory hierarchy, warp scheduling). Learn about Mixture of Experts inference tricks (expert offloading, speculative expert loading), and the emerging field of inference-time compute — how to optimally allocate compute between thinking tokens and answer tokens."
  },
  {
    id: 16,
    title: "LLMOps & Production",
    subtitle: "Running AI Systems in the Real World",
    time: "1–2 weeks",
    icon: "⊞",
    color: "#C6A0E8",
    intro: "Getting a model to work in a notebook is Phase 1. Running it reliably in production — with observability, cost control, safety guardrails, and regression testing — is where most of the professional work happens. LLMOps is the emerging discipline of operating LLM-powered systems at scale.",
    sections: [
      {
        name: "Observability for LLMs",
        items: [
          "Traditional observability (logs, metrics, traces) plus LLM-specific concerns: prompt/completion logging, token usage, latency per request, cost tracking, quality metrics over time",
          "Tools: LangSmith (LangChain ecosystem), Phoenix (Arize), Helicone (proxy-based), Braintrust, Weights & Biases. Each provides different tradeoffs between ease of integration and depth",
          "Trace-based observability: trace a request through your entire pipeline — retrieval → prompt construction → LLM call → post-processing → response. See where latency and failures occur",
          "Prompt versioning: treat prompts like code. Version them, track changes, A/B test variations. Small prompt changes can have large downstream effects",
          "Quality dashboards: track user ratings, LLM-as-judge scores, task completion rates, and hallucination frequency over time. Detect degradation before users complain"
        ]
      },
      {
        name: "Cost & Performance Management",
        items: [
          "Token-based pricing means cost is proportional to usage. A verbose system prompt repeated every request adds up fast. Optimize prompt length",
          "Semantic caching: cache responses for semantically similar queries. If 100 users ask the same question differently, serve the cached answer. Tools: GPTCache, Redis with vector search",
          "Model routing: use a small cheap model for easy queries, route hard queries to a powerful expensive model. The router itself can be a small classifier or LLM. Reduces cost 50-80% with minimal quality loss",
          "Prompt compression: reduce prompt length while preserving essential information. LLMLingua and similar tools can compress prompts by 2-5x",
          "Batching strategies: for offline workloads, batch requests to maximize GPU utilization. Anthropic and OpenAI offer batch APIs at 50% discounts"
        ]
      },
      {
        name: "Safety Guardrails in Production",
        items: [
          "Input guardrails: detect and block harmful, off-topic, or prompt injection attempts before they reach the model. Llama Guard, NeMo Guardrails, custom classifiers",
          "Output guardrails: check model outputs for harmful content, PII leakage, hallucinated facts, or off-brand responses before serving to users",
          "Prompt injection defense: users (or adversaries) embedding instructions in input to hijack the model's behavior. Defense-in-depth: input filtering, output monitoring, architectural separation of instructions from data",
          "PII handling: detect and redact personally identifiable information in both inputs and outputs. Particularly important for enterprise deployments with regulatory requirements",
          "Content moderation pipeline: model output → toxicity classifier → fact-checking (where applicable) → PII filter → serve. Each stage adds latency but reduces risk"
        ]
      },
      {
        name: "Evaluation & Testing in Production",
        items: [
          "Regression testing: automated test suites that run on every prompt/model change. Include edge cases, adversarial inputs, and critical use cases",
          "Drift detection: monitor whether model behavior changes over time (API-served models get updated). Track key metrics and alert on significant shifts",
          "Shadow deployments: run a new model in parallel with the current one, compare outputs without serving the new model to users. Catch issues before cutover",
          "Feedback loops: collect user feedback (thumbs up/down, corrections, complaints), feed it back into evaluation and fine-tuning. The system should get better from usage"
        ]
      }
    ],
    resources: [
      { name: "Chip Huyen: \"Building LLM Applications for Production\"", url: "https://huyenchip.com/2023/04/11/llm-engineering.html", note: "Essential overview of production concerns" },
      { name: "LangSmith documentation", url: "https://docs.smith.langchain.com/", note: "Leading LLM observability platform" },
      { name: "NeMo Guardrails docs", url: "https://docs.nvidia.com/nemo/guardrails/", note: "NVIDIA's guardrails framework" },
      { name: "Hamel Husain: \"Your AI Product Needs Evals\"", url: "https://hamel.dev/blog/posts/evals/", note: "Practical eval strategy for production systems" }
    ],
    deeper: "Study the emerging MLOps-to-LLMOps transition: how practices from traditional ML deployment (feature stores, model registries, A/B testing frameworks) adapt for LLMs. Read about compliance and audit requirements for regulated industries (finance, healthcare). Explore the open-source evaluation stack: promptfoo for systematic prompt testing, DeepEval for Python-native eval suites."
  },
  {
    id: 17,
    title: "Multimodality",
    subtitle: "Seeing, Hearing, Generating",
    time: "1–2 weeks",
    icon: "◑",
    color: "#DB7CB8",
    intro: "Language models started as text-only. Modern frontier models see images, hear audio, and generate across modalities. Multimodality is how AI starts to perceive the world the way humans do — through multiple senses simultaneously.",
    sections: [
      {
        name: "Vision Transformers & CLIP",
        items: [
          "ViT: treat an image as a sequence of patches (16×16). Project each patch into an embedding. Feed to a standard transformer. Works shockingly well",
          "CLIP: train image and text encoders jointly on 400M image-text pairs. Creates a shared embedding space where images and text are comparable. The bridge between vision and language",
          "SigLIP: improved CLIP training with sigmoid loss. Better performance, especially for vision-language models"
        ]
      },
      {
        name: "Vision-Language Models",
        items: [
          "Architecture: pre-trained LLM + vision encoder (CLIP-based) + adapter that maps image embeddings into the LLM's space",
          "GPT-4V, Claude's vision, Gemini: describe images, answer visual questions, extract text (OCR), analyze charts, reason about visual content",
          "Training: (1) align vision+language representations on image-caption pairs, (2) instruction-tune on visual Q&A and multimodal conversation"
        ]
      },
      {
        name: "Image & Video Generation",
        items: [
          "Diffusion models: start with noise, iteratively denoise guided by text. Stable Diffusion, DALL-E 3, Midjourney. Latent diffusion runs in compressed space for efficiency",
          "Flow matching: a cleaner mathematical framework for generation, increasingly replacing traditional diffusion. Used in Stable Diffusion 3 and Flux",
          "Video generation: extend diffusion to temporal sequences. Sora, Runway Gen-3, Veo. Enormous compute and data requirements"
        ]
      },
      {
        name: "Audio & Natively Multimodal",
        items: [
          "Whisper: robust speech-to-text on 680K hours. Handles accents, noise, multiple languages",
          "Audio tokens: convert waveforms to discrete tokens (EnCodec), then generate audio as token prediction — same transformer architecture",
          "Natively multimodal: train a single model on text + images + audio from the start (Gemini, GPT-4o). Rather than bolting modalities together, learn unified representations"
        ]
      }
    ],
    resources: [
      { name: "\"An Image is Worth 16x16 Words\" (ViT)", url: "https://arxiv.org/abs/2010.11929", note: "Vision transformers" },
      { name: "\"Learning Transferable Visual Models\" (CLIP)", url: "https://arxiv.org/abs/2103.00020", note: "Foundation of vision-language AI" },
      { name: "Lilian Weng: Diffusion Models", url: "https://lilianweng.github.io/posts/2021-07-11-diffusion-models/", note: "Clear math and intuition" },
      { name: "\"Visual Instruction Tuning\" (LLaVA)", url: "https://arxiv.org/abs/2304.08485", note: "Adding vision to an LLM" }
    ],
    deeper: "Study the unification of modalities: tokenizing images (VQ-VAE, VQGAN), 3D generation from text, and world models that learn physics from video. The Genie paper (DeepMind) and Sora technical report explore video as a world simulator."
  },
  {
    id: 18,
    title: "Interpretability",
    subtitle: "Opening the Black Box",
    time: "1–2 weeks",
    icon: "◎",
    color: "#E87C7C",
    intro: "We've built systems more capable than we can explain. Mechanistic interpretability aims to reverse-engineer neural networks into understandable components. This isn't academic curiosity — it's how we'll eventually build AI systems we can trust.",
    sections: [
      {
        name: "The Core Research Program",
        items: [
          "Features: the fundamental units of representation. A single neuron often represents a mixture of concepts (polysemanticity). Sparse Autoencoders (SAEs) decompose these into cleaner, interpretable features",
          "Circuits: connected subgraphs of features that implement computations. Example: induction heads — when the model sees AB...A, this circuit predicts B. An actual discovered mechanism for in-context learning",
          "Superposition: networks represent more features than dimensions by encoding them in overlapping sparse patterns. This is why individual neurons are hard to interpret",
          "Probing: train simple classifiers on internal representations to test what information is encoded. Linear probes can extract parse trees, facts, and more"
        ]
      },
      {
        name: "Scaling Interpretability",
        items: [
          "Anthropic's \"Scaling Monosemanticity\": applied SAEs to Claude 3 Sonnet, found millions of interpretable features — concepts like \"Golden Gate Bridge,\" \"code bugs,\" \"deception.\" Landmark result showing interpretability works at scale",
          "Feature steering: once you've found a feature (e.g., honesty), you can amplify or suppress it by directly modifying activations. A path toward fine-grained model control without retraining",
          "Representation engineering: directly modify a model's behavior by computing and adding \"control vectors\" derived from contrastive examples. Related to but distinct from feature-level interpretability",
          "Attribution methods: trace which inputs most influenced a specific output. Integrated gradients, attention attribution, and path patching are common approaches"
        ]
      }
    ],
    resources: [
      { name: "Anthropic: \"Scaling Monosemanticity\"", url: "https://transformer-circuits.pub/2024/scaling-monosemanticity/", note: "Landmark: finding interpretable features in Claude" },
      { name: "Neel Nanda: Mech Interp Quickstart", url: "https://www.neelnanda.io/mechanistic-interpretability/quickstart", note: "Best practical introduction" },
      { name: "Transformer Circuits Thread", url: "https://transformer-circuits.pub/", note: "Anthropic's full interpretability research program" }
    ],
    deeper: "Study the mathematical foundations of superposition (toy models of superposition paper), the connection between interpretability and model editing, and whether interpretability can provide safety guarantees. The open question: can we use interpretability to verify that a model doesn't have harmful capabilities or deceptive goals?"
  },
  {
    id: 19,
    title: "Safety, Ethics & Governance",
    subtitle: "The Stakes Beyond the Technical",
    time: "1–2 weeks",
    icon: "◆",
    color: "#E8A07C",
    intro: "Building frontier AI isn't just an engineering challenge — it's a societal one. A professional at a frontier lab needs to understand not only the technical safety work (alignment, red-teaming) but also the regulatory landscape, ethical frameworks, and the broader impact of what they're building. This phase goes beyond the technical safety of Phase 18 into the professional, legal, and societal context.",
    sections: [
      {
        name: "Technical Safety in Practice",
        items: [
          "Red-teaming: systematically eliciting dangerous or undesirable behavior. Manual (expert adversaries) and automated (using models to find failures). Standard practice before any model release",
          "Jailbreaking: techniques to bypass safety — many-shot prompting, encoding attacks, character roleplay, multilingual attacks. An ongoing cat-and-mouse game",
          "Dangerous capabilities evaluation: can the model help with bioweapons? Cyberattacks? Self-replication? Labs run specific evals before release (Anthropic's RSP, OpenAI's Preparedness Framework, DeepMind's Frontier Safety Framework)",
          "Deceptive alignment: the concern that a model might behave well during training but pursue different goals in deployment. Anthropic's \"Sleeper Agents\" showed this can be trained in and is hard to remove with standard techniques",
          "Open vs. closed: open weights enable scrutiny and research but lower the barrier for misuse. One of the most contentious debates in AI. No consensus"
        ]
      },
      {
        name: "Bias, Fairness & Harm",
        items: [
          "LLMs inherit biases from training data: gender stereotypes, racial biases, Western-centric worldviews, underrepresentation of marginalized groups. Post-training reduces but doesn't eliminate these",
          "Disparate performance: models typically perform better on English, on majority-culture topics, and for users who prompt in ways similar to the training data. This is a form of structural inequity",
          "Representational harm vs. allocative harm: models can reinforce stereotypes (representational) or produce worse outcomes for certain groups in consequential applications like hiring, lending, or medical diagnosis (allocative)",
          "Evaluation for fairness: test model outputs across demographic groups, languages, and cultural contexts. Bias benchmarks exist (BBQ, WinoBias) but are incomplete",
          "The impossibility theorem: perfect fairness across all definitions simultaneously is mathematically impossible (Chouldechova, 2017). You must choose which fairness criteria to prioritize"
        ]
      },
      {
        name: "Regulation & Governance",
        items: [
          "EU AI Act: the world's first comprehensive AI regulation. Risk-based framework. High-risk AI systems face mandatory requirements: transparency, human oversight, technical documentation. Foundation model providers have specific obligations",
          "US approach: executive orders, voluntary commitments, sector-specific regulation rather than a single comprehensive law. NIST AI Risk Management Framework is the key reference",
          "China's approach: regulation of generative AI requiring registration, content moderation, and alignment with \"core socialist values.\" Different priorities than Western frameworks",
          "Responsible Scaling Policies (RSPs): self-imposed commitments by labs to evaluate and mitigate risks at each capability level. Anthropic pioneered this approach. The question is whether self-regulation is sufficient",
          "Compute governance: should access to large-scale training compute be controlled? KYC (know-your-customer) requirements for cloud GPU providers. An active policy debate"
        ]
      },
      {
        name: "Copyright, IP & Economic Impact",
        items: [
          "Training data copyright: NYT vs OpenAI, Getty vs Stability AI, and dozens of other lawsuits testing whether training on copyrighted data is fair use. No settled law yet in most jurisdictions",
          "Output ownership: who owns AI-generated content? Current US Copyright Office position: purely AI-generated works aren't copyrightable. Human involvement is required, but the threshold is unclear",
          "Labor displacement: AI is automating tasks previously done by knowledge workers (writing, coding, analysis, translation, customer service). The economic transition requires attention",
          "Concentration of power: frontier model training requires enormous capital (~$1B+). This concentrates AI capability in a handful of organizations. Open-source (Llama, Mistral) partially counterbalances this"
        ]
      }
    ],
    resources: [
      { name: "Anthropic: \"Sleeper Agents\"", url: "https://arxiv.org/abs/2401.05566", note: "Can safety training detect deceptive behavior?" },
      { name: "Anthropic: Responsible Scaling Policy", url: "https://www.anthropic.com/news/anthropics-responsible-scaling-policy", note: "The framework for self-governance" },
      { name: "\"Concrete Problems in AI Safety\"", url: "https://arxiv.org/abs/1606.06565", note: "Foundational framing of safety challenges" },
      { name: "NIST AI Risk Management Framework", url: "https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence", note: "US government risk framework" },
      { name: "\"Stochastic Parrots\" (Bender et al.)", url: "https://dl.acm.org/doi/10.1145/3442188.3445922", note: "Influential critique of large language models" }
    ],
    deeper: "Study the different AI governance proposals: compute-based thresholds, capability-based testing, international coordination mechanisms. Read about the alignment tax (safety work that slows capability progress), the race dynamics between labs, and the emerging field of AI governance as a career. The question of whether transformative AI is 5 years or 50 years away dramatically changes which governance approaches make sense."
  },
  {
    id: 20,
    title: "Research Fluency",
    subtitle: "Thinking Like a Scientist",
    time: "Ongoing",
    icon: "◇",
    color: "#E8C87C",
    intro: "Frontier AI employees don't just know things — they read papers constantly, develop research taste, design experiments, and distinguish signal from noise in a field moving at breakneck speed. This isn't about knowledge — it's about the meta-skills that let you keep learning indefinitely.",
    sections: [
      {
        name: "How to Read an ML Paper",
        items: [
          "First pass (10 min): title, abstract, figures, conclusion. Know what they did and whether it matters",
          "Second pass (30–60 min): introduction and method. Understand the approach. Skip proofs and ablations",
          "Third pass (2–4 hours): work through the math, replicate equations on paper, study ablation tables. This is where real learning happens",
          "Most papers don't deserve a third pass. Read 20 abstracts, skim 5, deeply read 1. Develop taste for which deserve depth",
          "Read critically: what are unstated assumptions? What's the weakest claim? What experiments should they have run? What would convince you they're wrong?"
        ]
      },
      {
        name: "Keeping Up",
        items: [
          "ArXiv (cs.CL + cs.LG): new papers daily. Use Semantic Scholar or Connected Papers. Don't try to read everything — build filters",
          "Key blogs: Lilian Weng, Jay Alammar, Anthropic/Google/Meta research blogs, Chip Huyen, Sebastian Raschka. Often more valuable than papers for building intuition",
          "Twitter/X: real-time discussion layer. Follow researchers, not influencers. High noise but unmatched speed",
          "Conferences: NeurIPS, ICML, ICLR, ACL, EMNLP. Read accepted paper lists. Watch oral presentations"
        ]
      },
      {
        name: "Developing Research Taste",
        items: [
          "Distinguish incremental work from paradigm shifts. Most papers are incremental. The ones that matter introduce new ways of thinking, not just techniques",
          "Follow problems, not methods. \"How do we make models reason?\" is more durable than \"How do we improve chain-of-thought?\"",
          "Reproduce results. Implement one key experiment. You'll learn more than from reading 10 papers",
          "Understand competing worldviews: the compute thesis (intelligence = scale), the architecture thesis (need new paradigms), the data thesis (quality data is the bottleneck), the integration thesis (tools + search + reasoning). Reality is probably a combination"
        ]
      },
      {
        name: "The Map of Open Problems",
        items: [
          "Robust multi-step reasoning without brittle prompting",
          "Grounding: connecting language to the physical world",
          "Long-horizon planning and coherent agency",
          "Sample efficiency: learning from less data",
          "Mechanistic interpretability at scale",
          "Alignment that works for superhuman systems",
          "Efficient architectures that break the attention bottleneck",
          "Multimodal understanding that actually integrates modalities",
          "Know which are \"almost solved,\" which are progressing, and which feel stuck. This is research taste"
        ]
      }
    ],
    resources: [
      { name: "Karpathy: \"A Recipe for Training Neural Networks\"", url: "http://karpathy.github.io/2019/04/25/recipe/", note: "Practical wisdom on doing ML research" },
      { name: "Anthropic Research", url: "https://www.anthropic.com/research", note: "Frontier safety and interpretability" },
      { name: "Sebastian Ruder: NLP Newsletter", url: "https://newsletter.ruder.io/", note: "Monthly field overview, well-curated" },
      { name: "ML Street Talk", url: "https://www.youtube.com/@MachineLearningStreetTalk", note: "Deep technical researcher interviews" }
    ],
    deeper: "Read the historical arc: Perceptrons (1958) → backprop (1986) → deep learning (2012) → attention (2017) → scaling (2020) → alignment (2022+). Understanding why AI had \"winters\" gives perspective most practitioners lack. Goodfellow, Bengio & Courville's \"Deep Learning\" textbook remains the comprehensive reference."
  }
];

const PRIORITY_MAP = {
  "Building things now": [12, 13, 10, 16],
  "Understanding papers": [1, 4, 8, 20],
  "Systems engineering": [9, 15],
  "Safety & alignment": [11, 18, 19],
  "Breadth of knowledge": [5, 6, 14, 17]
};

function CodeBlock({ code }) {
  return (
    <pre style={{
      background: "#14110F",
      border: "1px solid rgba(212,145,94,0.1)",
      borderRadius: 8,
      padding: "16px 20px",
      overflowX: "auto",
      fontSize: 13,
      lineHeight: 1.65,
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      color: "#C4A882",
      margin: "12px 0"
    }}>
      <code>{code}</code>
    </pre>
  );
}

function ResourceLink({ r }) {
  return (
    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      padding: "10px 14px",
      background: "rgba(212,145,94,0.03)",
      border: "1px solid rgba(212,145,94,0.08)",
      borderRadius: 8,
      textDecoration: "none",
      color: "#C4A882",
      transition: "all 0.2s",
      marginBottom: 6
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "rgba(212,145,94,0.07)"; e.currentTarget.style.borderColor = "rgba(212,145,94,0.15)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "rgba(212,145,94,0.03)"; e.currentTarget.style.borderColor = "rgba(212,145,94,0.08)"; }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: "#EDE0D0", whiteSpace: "nowrap" }}>↗ {r.name}</span>
      <span style={{ fontSize: 12, color: "#8A7A68", fontStyle: "italic" }}>{r.note}</span>
    </a>
  );
}

function PhaseContent({ phase }) {
  const [showDeeper, setShowDeeper] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: "#C4A882", margin: 0 }}>{phase.intro}</p>
      {phase.sections?.map((section, si) => (
        <div key={si}>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 14px", fontWeight: 600, paddingBottom: 8, borderBottom: `1px solid ${phase.color}22` }}>{section.name}</h4>
          {section.items.map((item, ii) => (
            <div key={ii} style={{ padding: "10px 0", borderBottom: "1px solid rgba(212,145,94,0.05)", fontSize: 14, color: "#C4A882", lineHeight: 1.7 }}>{item}</div>
          ))}
        </div>
      ))}
      {phase.code && <CodeBlock code={phase.code} />}
      {phase.resources && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>Resources</h4>
          {phase.resources.map((r, i) => <ResourceLink key={i} r={r} />)}
        </div>
      )}
      {phase.deeper && (
        <div>
          <button onClick={() => setShowDeeper(!showDeeper)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px dashed rgba(212,145,94,0.15)", color: "#8A7A68", fontSize: 13, padding: "10px 16px", borderRadius: 8, cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = phase.color; e.currentTarget.style.color = phase.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,145,94,0.15)"; e.currentTarget.style.color = "#8A7A68"; }}>
            <span style={{ transform: showDeeper ? "rotate(90deg)" : "none", transition: "transform 0.2s", fontSize: 10 }}>▶</span>
            Want to go deeper?
          </button>
          {showDeeper && <p style={{ fontSize: 13, color: "#8A7A68", lineHeight: 1.75, padding: "14px 16px", margin: "8px 0 0", background: "rgba(212,145,94,0.03)", borderRadius: 8, fontStyle: "italic", borderLeft: `2px solid ${phase.color}33` }}>{phase.deeper}</p>}
        </div>
      )}
    </div>
  );
}

export default function GenAIRoadmap({ onBack }) {
  const [activePhase, setActivePhase] = useState(1);
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('genai-roadmap-progress');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [showNav, setShowNav] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const contentRef = useRef(null);
  const skipSync = useRef(false);

  const phase = PHASES.find(p => p.id === activePhase);
  const progress = Math.round((completed.size / PHASES.length) * 100);

  const loadProgress = useCallback(async (userId) => {
    if (!supabase) return;
    const { data } = await supabase
      .from('user_progress')
      .select('completed_phases')
      .eq('user_id', userId)
      .eq('curriculum', 'genai')
      .single();
    if (data?.completed_phases) {
      skipSync.current = true;
      setCompleted(new Set(data.completed_phases));
      localStorage.setItem('genai-roadmap-progress', JSON.stringify(data.completed_phases));
    }
  }, []);

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProgress(session.user.id);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProgress(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [loadProgress]);

  const toggleComplete = (id) => {
    setCompleted(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  useEffect(() => {
    const arr = [...completed];
    try { localStorage.setItem('genai-roadmap-progress', JSON.stringify(arr)); } catch {}
    if (skipSync.current) { skipSync.current = false; return; }
    if (!supabase || !user) return;
    supabase.from('user_progress').upsert({
      user_id: user.id,
      curriculum: 'genai',
      completed_phases: arr,
      updated_at: new Date().toISOString()
    });
  }, [completed, user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthError('');
    setAuthSubmitting(true);
    const { error } = authMode === 'signup'
      ? await supabase.auth.signUp({ email: authEmail, password: authPassword })
      : await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    setAuthSubmitting(false);
    if (error) { setAuthError(error.message); return; }
    if (authMode === 'signup') { setAuthError('Check your email to confirm your account.'); return; }
    setShowAuthModal(false);
    setAuthEmail('');
    setAuthPassword('');
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [activePhase]);

  return (
    <div style={{ fontFamily: "'Newsreader', Georgia, serif", background: "#0F0D0A", color: "#EDE0D0", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <header style={{ padding: "14px 24px", borderBottom: "1px solid rgba(212,145,94,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "#0F0D0A", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#8A7A68", fontSize: 13, cursor: "pointer", padding: "4px 8px", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
          )}
          <button onClick={() => setShowNav(!showNav)} style={{ background: "none", border: "none", color: "#EDE0D0", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>{showNav ? "✕" : "☰"}</button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: -0.3, fontFamily: "'DM Sans', sans-serif" }}>Generative AI <span style={{ color: "#D4915E" }}>Foundations</span></h1>
            <p style={{ fontSize: 10, color: "#8A7A68", margin: 0, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>From zero to frontier lab fluency</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#8A7A68", fontFamily: "'IBM Plex Mono', monospace" }}>{completed.size}/{PHASES.length}</span>
          <div style={{ width: 80, height: 4, background: "rgba(212,145,94,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #D4915E, #E8C857)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          {supabase && !authLoading && (
            user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                <span style={{ fontSize: 12, color: "#8A7A68", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
                <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(212,145,94,0.15)", color: "#8A7A68", fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>Sign out</button>
              </div>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setAuthMode('signin'); setAuthError(''); }} style={{ background: "rgba(212,145,94,0.1)", border: "1px solid rgba(212,145,94,0.2)", color: "#D4915E", fontSize: 11, padding: "4px 12px", borderRadius: 6, cursor: "pointer", marginLeft: 8 }}>Sign in</button>
            )
          )}
        </div>
      </header>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <nav style={{ width: showNav ? 300 : 0, minWidth: showNav ? 300 : 0, borderRight: showNav ? "1px solid rgba(212,145,94,0.08)" : "none", overflow: "hidden", transition: "all 0.3s ease", background: "#0C0A08", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {PHASES.map(p => (
              <button key={p.id} onClick={() => { setActivePhase(p.id); setShowNav(false); }}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", background: activePhase === p.id ? `${p.color}0D` : "transparent", border: activePhase === p.id ? `1px solid ${p.color}1A` : "1px solid transparent", borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                <span onClick={(e) => { e.stopPropagation(); toggleComplete(p.id); }}
                  style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: completed.has(p.id) ? `2px solid ${p.color}` : "2px solid rgba(212,145,94,0.15)", background: completed.has(p.id) ? `${p.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: p.color, cursor: "pointer", transition: "all 0.2s" }}>
                  {completed.has(p.id) ? "✓" : ""}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: activePhase === p.id ? 600 : 400, color: activePhase === p.id ? "#EDE0D0" : "#8A7A68", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: p.color, marginRight: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{String(p.id).padStart(2, "0")}</span>{p.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#6A5A48", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.subtitle}</div>
                </div>
                <span style={{ fontSize: 10, color: "#6A5A48", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>{p.time}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: 16, borderTop: "1px solid rgba(212,145,94,0.08)" }}>
            <h4 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#6A5A48", margin: "0 0 10px", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>Focus Tracks</h4>
            {Object.entries(PRIORITY_MAP).map(([activity, ids]) => (
              <button key={activity} onClick={() => { setActivePhase(ids[0]); setShowNav(false); }}
                style={{ display: "block", width: "100%", padding: "6px 0", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, color: "#8A7A68", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#D4915E"}
                onMouseLeave={e => e.currentTarget.style.color = "#8A7A68"}>
                {activity} → {ids.map(id => String(id).padStart(2, "0")).join(", ")}
              </button>
            ))}
          </div>
        </nav>
        <main ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "40px 32px 80px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: phase.color, fontWeight: 600 }}>Phase {String(phase.id).padStart(2, "0")}</span>
              <span style={{ fontSize: 12, color: "#6A5A48", fontFamily: "'IBM Plex Mono', monospace" }}>{phase.time}</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5, lineHeight: 1.1, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: phase.color, marginRight: 8 }}>{phase.icon}</span>{phase.title}
            </h2>
            <p style={{ fontSize: 17, color: "#8A7A68", margin: 0, fontWeight: 300 }}>{phase.subtitle}</p>
          </div>
          <button onClick={() => toggleComplete(phase.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", background: completed.has(phase.id) ? `${phase.color}0D` : "rgba(212,145,94,0.03)", border: `1px solid ${completed.has(phase.id) ? phase.color + "33" : "rgba(212,145,94,0.08)"}`, borderRadius: 8, cursor: "pointer", color: completed.has(phase.id) ? phase.color : "#8A7A68", fontSize: 13, fontWeight: 500, marginBottom: 32, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${completed.has(phase.id) ? phase.color : "rgba(212,145,94,0.2)"}`, background: completed.has(phase.id) ? `${phase.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, transition: "all 0.2s" }}>
              {completed.has(phase.id) ? "✓" : ""}
            </span>
            {completed.has(phase.id) ? "Completed" : "Mark as completed"}
          </button>
          <PhaseContent phase={phase} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(212,145,94,0.08)" }}>
            <button onClick={() => activePhase > 1 && setActivePhase(activePhase - 1)} disabled={activePhase === 1}
              style={{ padding: "10px 20px", background: activePhase === 1 ? "transparent" : "rgba(212,145,94,0.03)", border: `1px solid ${activePhase === 1 ? "transparent" : "rgba(212,145,94,0.08)"}`, borderRadius: 8, color: activePhase === 1 ? "#3A2A18" : "#8A7A68", cursor: activePhase === 1 ? "default" : "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              ← Previous
            </button>
            <button onClick={() => activePhase < PHASES.length && setActivePhase(activePhase + 1)} disabled={activePhase === PHASES.length}
              style={{ padding: "10px 20px", background: activePhase === PHASES.length ? "transparent" : `${PHASES[activePhase]?.color || phase.color}0D`, border: `1px solid ${activePhase === PHASES.length ? "transparent" : (PHASES[activePhase]?.color || phase.color) + "22"}`, borderRadius: 8, color: activePhase === PHASES.length ? "#3A2A18" : PHASES[activePhase]?.color || phase.color, cursor: activePhase === PHASES.length ? "default" : "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
              Next: {PHASES[activePhase]?.title || "Done"} →
            </button>
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div onClick={() => setShowAuthModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1A1710", border: "1px solid rgba(212,145,94,0.15)", borderRadius: 12, padding: 32, width: 340, maxWidth: "90vw" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{authMode === 'signin' ? 'Sign in' : 'Create account'}</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#8A7A68" }}>Sync your progress across devices</p>
            <form onSubmit={handleAuth}>
              <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required
                style={{ width: "100%", padding: "10px 12px", background: "rgba(212,145,94,0.05)", border: "1px solid rgba(212,145,94,0.15)", borderRadius: 6, color: "#EDE0D0", fontSize: 13, marginBottom: 8, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required minLength={6}
                style={{ width: "100%", padding: "10px 12px", background: "rgba(212,145,94,0.05)", border: "1px solid rgba(212,145,94,0.15)", borderRadius: 6, color: "#EDE0D0", fontSize: 13, marginBottom: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              {authError && <p style={{ fontSize: 12, color: authError.includes('Check your email') ? '#6BC4A6' : '#D4915E', margin: "0 0 12px" }}>{authError}</p>}
              <button type="submit" disabled={authSubmitting}
                style={{ width: "100%", padding: "10px", background: "#D4915E", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: authSubmitting ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: authSubmitting ? 0.7 : 1 }}>
                {authSubmitting ? '...' : authMode === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            </form>
            <p style={{ margin: "16px 0 0", fontSize: 12, color: "#8A7A68", textAlign: "center" }}>
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError(''); }} style={{ color: "#D4915E", cursor: "pointer" }}>
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
