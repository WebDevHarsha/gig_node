// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FreelancePlatform is ReentrancyGuard, Ownable {
    struct Project {
        address payable client;
        address payable freelancer;
        uint256 amount;
        uint256 deadline;
        bool isComplete;
        bool exists;
        ProjectStatus status;
    }

    enum ProjectStatus {
        Open,
        InProgress,
        Completed,
        Disputed,
        Cancelled
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCounter;
    uint256 public platformFee; // in basis points (1% = 100)
    
    // Added max fee limit for safety
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10% maximum fee

    event ProjectCreated(uint256 indexed projectId, address indexed client, uint256 amount);
    event ProjectAccepted(uint256 indexed projectId, address indexed freelancer);
    event ProjectCompleted(uint256 indexed projectId);
    event ProjectDisputed(uint256 indexed projectId);
    event FundsReleased(uint256 indexed projectId, address indexed freelancer, uint256 amount);
    event ProjectCancelled(uint256 indexed projectId);
    event PlatformFeeUpdated(uint256 newFee);

    constructor(uint256 _platformFee) Ownable(msg.sender) {
        require(_platformFee <= MAX_PLATFORM_FEE, "Fee too high");
        platformFee = _platformFee;
    }

    function createProject(uint256 _deadline) external payable nonReentrant {
        require(msg.value > 0, "Must include payment");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_deadline <= block.timestamp + 365 days, "Deadline too far in future");

        uint256 projectId = projectCounter++;
        
        projects[projectId] = Project({
            client: payable(msg.sender),
            freelancer: payable(address(0)),
            amount: msg.value,
            deadline: _deadline,
            isComplete: false,
            exists: true,
            status: ProjectStatus.Open
        });

        emit ProjectCreated(projectId, msg.sender, msg.value);
    }

    function acceptProject(uint256 _projectId) external nonReentrant {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        require(project.status == ProjectStatus.Open, "Project not open");
        require(project.client != msg.sender, "Client cannot be freelancer");
        require(block.timestamp < project.deadline, "Project deadline passed");

        project.freelancer = payable(msg.sender);
        project.status = ProjectStatus.InProgress;

        emit ProjectAccepted(_projectId, msg.sender);
    }

    function completeProject(uint256 _projectId) external nonReentrant {
        Project storage project = projects[_projectId];
        require(msg.sender == project.client, "Only client can complete");
        require(project.status == ProjectStatus.InProgress, "Project not in progress");

        uint256 fee = (project.amount * platformFee) / 10000;
        uint256 payment = project.amount - fee;

        project.status = ProjectStatus.Completed;
        project.isComplete = true;

        // Transfer payment to freelancer
        (bool sentToFreelancer, ) = project.freelancer.call{value: payment}("");
        require(sentToFreelancer, "Failed to send payment to freelancer");

        // Transfer fee to platform owner
        if (fee > 0) {
            (bool sentFee, ) = owner().call{value: fee}("");
            require(sentFee, "Failed to send platform fee");
        }

        emit ProjectCompleted(_projectId);
        emit FundsReleased(_projectId, project.freelancer, payment);
    }

    function initiateDispute(uint256 _projectId) external nonReentrant {
        Project storage project = projects[_projectId];
        require(msg.sender == project.client || msg.sender == project.freelancer, "Not authorized");
        require(project.status == ProjectStatus.InProgress, "Project not in progress");
        require(block.timestamp <= project.deadline, "Project deadline passed");

        project.status = ProjectStatus.Disputed;
        emit ProjectDisputed(_projectId);
    }

    function resolveDispute(
        uint256 _projectId, 
        address payable _recipient, 
        uint256 _amount
    ) external onlyOwner nonReentrant {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Disputed, "Project not disputed");
        require(_amount <= project.amount, "Amount exceeds project budget");
        require(
            _recipient == project.client || _recipient == project.freelancer,
            "Invalid recipient"
        );

        project.status = ProjectStatus.Completed;
        project.isComplete = true;

        (bool sent, ) = _recipient.call{value: _amount}("");
        require(sent, "Failed to send payment");

        // If there's remaining balance, send it to the other party
        uint256 remaining = project.amount - _amount;
        if (remaining > 0) {
            address payable otherParty = _recipient == project.client ? 
                project.freelancer : project.client;
            (bool sentRemaining, ) = otherParty.call{value: remaining}("");
            require(sentRemaining, "Failed to send remaining amount");
        }

        emit FundsReleased(_projectId, _recipient, _amount);
    }

    function cancelProject(uint256 _projectId) external nonReentrant {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        require(
            project.status == ProjectStatus.Open || 
            (project.status == ProjectStatus.InProgress && block.timestamp > project.deadline),
            "Cannot cancel project"
        );
        require(
            msg.sender == project.client || 
            (msg.sender == project.freelancer && project.status == ProjectStatus.InProgress),
            "Not authorized"
        );

        project.status = ProjectStatus.Cancelled;

        // Refund the client
        (bool sent, ) = project.client.call{value: project.amount}("");
        require(sent, "Failed to refund client");

        emit ProjectCancelled(_projectId);
    }

    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= MAX_PLATFORM_FEE, "Fee too high");
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    // View function to get project details
    function getProject(uint256 _projectId) external view returns (
        address client,
        address freelancer,
        uint256 amount,
        uint256 deadline,
        bool isComplete,
        ProjectStatus status
    ) {
        Project storage project = projects[_projectId];
        require(project.exists, "Project does not exist");
        
        return (
            project.client,
            project.freelancer,
            project.amount,
            project.deadline,
            project.isComplete,
            project.status
        );
    }
}