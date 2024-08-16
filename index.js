// init start = 0, end = array.length - 1, mid = (start + end) / 2
// Create a tree node with mid as root called a
// recursively do steps 4 - 5
// calculate mid of left subarray and make it root of left subtree of a
// calculate mid of right subarray and make it root of right subtree of a

class Node {
    constructor(data) {
        this.data = data,
            this.left = null,
            this.right = null
    }
}

class Tree {
    constructor(array) {
        this.root = this.buildTree(array)
    }

    buildTree(array) {
        array = [... new Set(array.sort((a, b) => a - b))];

        if (array.length === 0) return null;

        const mid = Math.floor(array.length / 2);
        const rootNode = new Node(array[mid]);

        rootNode.left = this.buildTree(array.slice(0, mid));
        rootNode.right = this.buildTree(array.slice(mid + 1));

        return rootNode;
    }

    insert(value) {
        let rootNode = this.root;

        if (this.rootNode === null) {
            this.root = new Node(value);
            return;
        }

        let currentNode = rootNode
        while (true) {
            if (value < currentNode.data) {
                if (currentNode.left === null) {
                    currentNode.left = new Node(value);
                    break;
                } else {
                    currentNode = currentNode.left
                }
            } else {
                if (currentNode.right === null) {
                    currentNode.right = new Node(value);
                    break;
                } else {
                    currentNode = currentNode.right
                }
            }
        }
    }

    deleteItem(value) {
        let currentNode = this.root;
        let parentNode = null;

        while (currentNode !== null) {
            if (value < currentNode.data) {
                parentNode = currentNode;
                currentNode = currentNode.left; // moves us to the left node
            } else if (value > currentNode.data) {
                parentNode = currentNode;
                currentNode = currentNode.right;
            } else {
                if (currentNode.left === null && currentNode.right === null) {
                    if (parentNode === null) {
                        this.root = null;
                    } else if (parentNode.left === currentNode) {
                        parentNode.left = null;
                    } else {
                        parentNode.right = null;
                    }
                }
                else if (currentNode.left === null || currentNode.right === null) {
                    const childNode = currentNode.left !== null ? currentNode.left : currentNode.right;

                    if (parentNode === null) {
                        this.root = childNode;
                    } else if (parentNode.left === currentNode) {
                        parentNode.left = childNode;
                    } else {
                        parentNode.right = childNode;
                    }
                }

                else {
                    let successorParent = currentNode;
                    let successor = currentNode.right;
                    while (successor.left !== null) {
                        successorParent = successor;
                        successor = successor.left;
                    }
                    currentNode.data = successor.data;

                    if (successorParent.left === successor) {
                        successorParent.left = successor.right;
                    } else {
                        successorParent.right = successor.right;
                    }
                }
                break;
            }
        }
    }

    levelOrder(callback) {
        if (typeof callback !== 'function') {
            throw new Error('A callback function is required');
        }
        let queue = [];
        let currentNode = this.root;

        if (currentNode !== null) {
            queue.push(currentNode);
        }

        while (queue.length > 0) {
            currentNode = queue.shift();
            callback(currentNode);

            if (currentNode.left !== null) {
                queue.push(currentNode.left);
            }

            if (currentNode.right !== null) {
                queue.push(currentNode.right);
            }
        }
    }

    inOrder(callback) {
        if (typeof callback !== 'function') {
            throw new Error('A callback function is required')
        }

        function traverse(node) {
            if (node !== null) {
                traverse(node.left);
                callback(node);
                traverse(node.right);
            }
        }

        traverse(this.root)
    }

    preOrder(callback) {
        if (typeof callback !== 'function') {
            throw new Error('A callback function is required')
        }

        function traverse(node) {
            if (node !== null) {
                callback(node);
                traverse(node.left);
                traverse(node.right);
            }
        }
        traverse(this.root);
    }

    postOrder(callback) {
        if (typeof callback !== 'function') {
            throw new Error('A callback function is required')
        }

        function traverse(node) {
            if (node !== null) {
                traverse(node.left);
                traverse(node.right);
                callback(node);
            }
        }
        traverse(this.root);
    }

    height(node) {
        if (node === null) return -1;

        let leftHeight = this.height(node.left);
        let rightHeight = this.height(node.right);

        return Math.max(leftHeight, rightHeight) + 1;
    }

    depth(node) {
        if (node === this.root) return 0;

        let currentNode = this.root;
        let depthCount = 0;

        while (currentNode !== null) {
            if (node.data < currentNode.data) {
                currentNode = currentNode.left;
                depthCount++;
            } else if (node.data > currentNode.data) {
                currentNode = currentNode.right;
                depthCount++
            } else {
                return depthCount;
            }
        }
        return null;
    }

    isBalanced(node = this.root) {
        if (node === null) return true;

        let leftHeight = this.height(node.left);
        let rightHeight = this.height(node.right);

        if (Math.abs(leftHeight - rightHeight) > 1) return false;

        return this.isBalanced(node.left) && this.isBalanced(node.right);
    }

    rebalance() {
        const nodes = [];

        this.inOrder(node => nodes.push(node.data));
        this.root = this.buildTree(nodes);
    }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};



function getRandomArray(size, max) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

function runDriverScript() {
    // Step 1: Create a binary search tree from an array of random numbers < 100
    const randomNumbers = getRandomArray(15, 100);
    const tree = new Tree(randomNumbers);

    console.log("Initial Tree Created:");
    console.log("Is tree balanced? ", tree.isBalanced());

    // Step 2: Print out all elements in level, pre, post, and in order
    console.log("Level Order: ");
    tree.levelOrder(node => console.log(node.data));
    console.log("Pre Order: ");
    tree.preOrder(node => console.log(node.data));
    console.log("Post Order: ");
    tree.postOrder(node => console.log(node.data));
    console.log("In Order: ");
    tree.inOrder(node => console.log(node.data));

    // Step 3: Unbalance the tree by adding several numbers > 100
    tree.insert(150);
    tree.insert(200);
    tree.insert(250);

    console.log("\nAfter adding numbers > 100:");
    console.log("Is tree balanced? ", tree.isBalanced());

    // Step 4: Balance the tree by calling rebalance
    tree.rebalance();

    console.log("\nAfter rebalancing:");
    console.log("Is tree balanced? ", tree.isBalanced());

    // Step 5: Print out all elements in level, pre, post, and in order
    console.log("Level Order: ");
    tree.levelOrder(node => console.log(node.data));
    console.log("Pre Order: ");
    tree.preOrder(node => console.log(node.data));
    console.log("Post Order: ");
    tree.postOrder(node => console.log(node.data));
    console.log("In Order: ");
    tree.inOrder(node => console.log(node.data));
}

// Run the driver script
runDriverScript();