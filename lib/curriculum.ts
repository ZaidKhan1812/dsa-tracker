export interface CurriculumResource {
  type: 'video' | 'article';
  title: string;
  url: string;
}

export interface CurriculumProblem {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  url: string;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  resources: CurriculumResource[];
  practiceProblems: CurriculumProblem[];
}

export interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  topics: CurriculumTopic[];
}

export const curriculum: CurriculumModule[] = [
  {
    id: "arrays-and-hashing",
    title: "Arrays & Hashing",
    description: "The fundamental building block. Learn how to store data contiguously and retrieve it instantly using hash maps.",
    icon: "database",
    topics: [
      {
        id: "arrays-101",
        title: "Introduction to Arrays",
        description: "Understand static and dynamic arrays, memory allocation, and basic traversal operations.",
        difficulty: "easy",
        resources: [
          { type: 'video', title: 'Data Structures: Arrays', url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM' }
        ],
        practiceProblems: [
          { title: "Contains Duplicate", difficulty: "easy", url: "https://leetcode.com/problems/contains-duplicate/" },
          { title: "Valid Anagram", difficulty: "easy", url: "https://leetcode.com/problems/valid-anagram/" }
        ]
      },
      {
        id: "hashing-fundamentals",
        title: "Hash Maps & Sets",
        description: "Master O(1) lookups. Learn hash functions, collision resolution, and how sets differ from maps.",
        difficulty: "easy",
        resources: [
          { type: 'video', title: 'Data Structures: Hash Tables', url: 'https://www.youtube.com/watch?v=shs0KM3wKv8' }
        ],
        practiceProblems: [
          { title: "Two Sum", difficulty: "easy", url: "https://leetcode.com/problems/two-sum/" },
          { title: "Group Anagrams", difficulty: "medium", url: "https://leetcode.com/problems/group-anagrams/" }
        ]
      }
    ]
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    description: "Optimize array and string traversals using multiple converging or identical-direction pointers.",
    icon: "arrow-right-left",
    topics: [
      {
        id: "two-pointers-basics",
        title: "Two Pointers Basics",
        description: "Learn to process sorted arrays efficiently by starting pointers at opposite ends.",
        difficulty: "easy",
        resources: [
          { type: 'video', title: 'Two Pointer Technique Explained', url: 'https://www.youtube.com/watch?v=On03HWe2tZM' }
        ],
        practiceProblems: [
          { title: "Valid Palindrome", difficulty: "easy", url: "https://leetcode.com/problems/valid-palindrome/" },
          { title: "Two Sum II", difficulty: "medium", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
          { title: "3Sum", difficulty: "medium", url: "https://leetcode.com/problems/3sum/" }
        ]
      }
    ]
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    description: "Sequential data structures where elements point to the next. Learn pointer manipulation and fast/slow pointer techniques.",
    icon: "link",
    topics: [
      {
        id: "singly-linked-lists",
        title: "Singly Linked Lists",
        description: "Basic operations: reverse, merge, and detect cycles.",
        difficulty: "medium",
        resources: [
          { type: 'video', title: 'Data Structures: Linked Lists', url: 'https://www.youtube.com/watch?v=njTh_OwMmlA' }
        ],
        practiceProblems: [
          { title: "Reverse Linked List", difficulty: "easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
          { title: "Merge Two Sorted Lists", difficulty: "easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
          { title: "Linked List Cycle", difficulty: "easy", url: "https://leetcode.com/problems/linked-list-cycle/" }
        ]
      }
    ]
  },
  {
    id: "trees",
    title: "Trees",
    description: "Hierarchical data structures. Master traversing nodes via Depth-First Search (DFS) and Breadth-First Search (BFS).",
    icon: "git-merge",
    topics: [
      {
        id: "binary-trees",
        title: "Binary Trees & BSTs",
        description: "Learn tree traversals (in-order, pre-order, post-order) and validating binary search properties.",
        difficulty: "medium",
        resources: [
          { type: 'video', title: 'Data Structures: Trees', url: 'https://www.youtube.com/watch?v=oSWTXtMglKE' }
        ],
        practiceProblems: [
          { title: "Invert Binary Tree", difficulty: "easy", url: "https://leetcode.com/problems/invert-binary-tree/" },
          { title: "Maximum Depth of Binary Tree", difficulty: "easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
          { title: "Lowest Common Ancestor", difficulty: "medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" }
        ]
      }
    ]
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    description: "Break complex recursive problems into simpler subproblems. Master memoization and tabulation.",
    icon: "brain-circuit",
    topics: [
      {
        id: "1d-dp",
        title: "1-Dimensional DP",
        description: "Solve problems by keeping track of the previous one or two states.",
        difficulty: "medium",
        resources: [
          { type: 'video', title: 'Dynamic Programming - Learn to Solve Algorithmic Problems', url: 'https://www.youtube.com/watch?v=oBt53YbR9Kk' }
        ],
        practiceProblems: [
          { title: "Climbing Stairs", difficulty: "easy", url: "https://leetcode.com/problems/climbing-stairs/" },
          { title: "House Robber", difficulty: "medium", url: "https://leetcode.com/problems/house-robber/" },
          { title: "Coin Change", difficulty: "medium", url: "https://leetcode.com/problems/coin-change/" }
        ]
      }
    ]
  }
];
