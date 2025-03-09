document.addEventListener('DOMContentLoaded', () => {
    const fidelityManager = new FidelityManager();
});

class FidelityManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.pointsSystem = {
            bronze: { min: 0, max: 999, discount: 5 },
            silver: { min: 1000, max: 2499, discount: 10 },
            gold: { min: 2500, max: 4999, discount: 15 },
            platinum: { min: 5000, max: Infinity, discount: 20 }
        };
        
        this.rewards = [
            {
                id: 1,
                name: "Bon d'achat 10€",
                points: 1000,
                image: "https://via.placeholder.com/200x200?text=Bon+10€"
            },
            {
                id: 2,
                name: "Livraison Premium 1 an",
                points: 2500,
                image: "https://via.placeholder.com/200x200?text=Livraison+Premium"
            },
            {
                id: 3,
                name: "Bon d'achat 50€",
                points: 5000,
                image: "https://via.placeholder.com/200x200?text=Bon+50€"
            },
            {
                id: 4,
                name: "Cadeau Surprise VIP",
                points: 10000,
                image: "https://via.placeholder.com/200x200?text=Cadeau+VIP"
            }
        ];

        this.initializeUserData();
        this.loadRewards();
        this.loadTransactionHistory();
        this.setupReferralSystem();
        this.initializeEventListeners();
    }

    initializeUserData() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // Get or initialize user fidelity data
        let fidelityData = JSON.parse(localStorage.getItem(`fidelity_${this.currentUser.email}`)) || {
            points: 0,
            transactions: [],
            rewards: [],
            referrals: []
        };

        this.updatePointsDisplay(fidelityData.points);
        this.updateMemberStatus(fidelityData.points);
    }

    updatePointsDisplay(points) {
        document.getElementById('totalPoints').textContent = points;
    }

    updateMemberStatus(points) {
        let status = 'Bronze';
        let progress = 0;
        let pointsToNext = 0;

        if (points >= this.pointsSystem.platinum.min) {
            status = 'Platinum';
            progress = 100;
            pointsToNext = 0;
        } else if (points >= this.pointsSystem.gold.min) {
            status = 'Gold';
            progress = 75;
            pointsToNext = this.pointsSystem.platinum.min - points;
        } else if (points >= this.pointsSystem.silver.min) {
            status = 'Silver';
            progress = 50;
            pointsToNext = this.pointsSystem.gold.min - points;
        } else {
            progress = (points / this.pointsSystem.silver.min) * 25;
            pointsToNext = this.pointsSystem.silver.min - points;
        }

        document.getElementById('memberStatus').textContent = status;
        document.getElementById('statusProgress').style.width = `${progress}%`;
        document.getElementById('pointsToNext').textContent = pointsToNext;
    }

    loadRewards() {
        const rewardsGrid = document.getElementById('rewardsGrid');
        rewardsGrid.innerHTML = '';

        this.rewards.forEach(reward => {
            const rewardEl = document.createElement('div');
            rewardEl.classList.add('reward-card');
            rewardEl.innerHTML = `
                <img src="${reward.image}" alt="${reward.name}">
                <h3>${reward.name}</h3>
                <p>${reward.points} points</p>
                <button class="redeem-btn" data-reward-id="${reward.id}">
                    Échanger
                </button>
            `;
            rewardsGrid.appendChild(rewardEl);
        });
    }

    loadTransactionHistory() {
        const historyContainer = document.getElementById('transactionHistory');
        const fidelityData = JSON.parse(localStorage.getItem(`fidelity_${this.currentUser.email}`));

        if (!fidelityData || !fidelityData.transactions.length) {
            historyContainer.innerHTML = `
                <tr>
                    <td colspan="4">Aucune transaction pour le moment</td>
                </tr>
            `;
            return;
        }

        historyContainer.innerHTML = fidelityData.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(transaction => `
                <tr>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td>${transaction.description}</td>
                    <td class="${transaction.points >= 0 ? 'points-gained' : 'points-spent'}">
                        ${transaction.points >= 0 ? '+' : ''}${transaction.points}
                    </td>
                    <td>${transaction.status}</td>
                </tr>
            `).join('');
    }

    setupReferralSystem() {
        const referralLink = document.getElementById('referralLink');
        const referralCode = this.generateReferralCode();
        const referralUrl = `${window.location.origin}/signup.html?ref=${referralCode}`;
        referralLink.value = referralUrl;

        // Setup copy button
        document.getElementById('copyLink').addEventListener('click', () => {
            referralLink.select();
            document.execCommand('copy');
            alert('Lien de parrainage copié !');
        });

        // Setup social sharing
        document.querySelector('.share-btn.facebook').addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`);
        });

        document.querySelector('.share-btn.twitter').addEventListener('click', () => {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl)}&text=Rejoignez-moi sur EdenMarket !`);
        });

        document.querySelector('.share-btn.whatsapp').addEventListener('click', () => {
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('Rejoignez-moi sur EdenMarket ! ' + referralUrl)}`);
        });
    }

    generateReferralCode() {
        return this.currentUser.email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 6);
    }

    initializeEventListeners() {
        // Handle reward redemption
        document.querySelectorAll('.redeem-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const rewardId = e.target.dataset.rewardId;
                this.redeemReward(rewardId);
            });
        });
    }

    redeemReward(rewardId) {
        const reward = this.rewards.find(r => r.id === parseInt(rewardId));
        const fidelityData = JSON.parse(localStorage.getItem(`fidelity_${this.currentUser.email}`));

        if (fidelityData.points < reward.points) {
            alert('Points insuffisants pour cette récompense');
            return;
        }

        // Update points
        fidelityData.points -= reward.points;
        fidelityData.transactions.push({
            date: new Date().toISOString(),
            description: `Échange: ${reward.name}`,
            points: -reward.points,
            status: 'Complété'
        });
        fidelityData.rewards.push({
            id: reward.id,
            date: new Date().toISOString(),
            name: reward.name
        });

        localStorage.setItem(`fidelity_${this.currentUser.email}`, JSON.stringify(fidelityData));
        
        this.updatePointsDisplay(fidelityData.points);
        this.updateMemberStatus(fidelityData.points);
        this.loadTransactionHistory();

        alert(`Félicitations ! Vous avez échangé vos points contre "${reward.name}"`);
    }
}

// Add these styles to your CSS
const styles = `
    .fidelite-header {
        background: linear-gradient(to right, #FFD700, #FFA500);
    }

    .points-summary {
        padding: 20px;
    }

    .points-card {
        background: white;
        border-radius: 10px;
        padding: 30px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 0 auto;
    }

    .points-display {
        font-size: 3em;
        margin: 20px 0;
        color: #FFD700;
    }

    .member-status {
        margin-top: 20px;
    }

    .progress-bar {
        background: #f0f0f0;
        height: 20px;
        border-radius: 10px;
        margin: 15px 0;
        overflow: hidden;
    }

    .progress {
        background: linear-gradient(to right, #FFD700, #FFA500);
        height: 100%;
        transition: width 0.3s ease;
    }

    .benefits-grid,
    .earn-points-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .benefit-card,
    .earn-method {
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .benefit-card i,
    .earn-method i {
        font-size: 2em;
        color: #FFD700;
        margin-bottom: 15px;
    }

    .rewards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .reward-card {
        background: white;
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .reward-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .redeem-btn {
        background: #FFD700;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .redeem-btn:hover {
        background: #FFA500;
    }

    .history-table-container {
        overflow-x: auto;
        padding: 20px;
    }

    .history-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 10px;
        overflow: hidden;
    }

    .history-table th,
    .history-table td {
        padding: 15px;
        text-align: left;
        border-bottom: 1px solid #f0f0f0;
    }

    .history-table th {
        background: #f8f8f8;
    }

    .points-gained {
        color: #4CAF50;
    }

    .points-spent {
        color: #f44336;
    }

    .referral-section {
        padding: 20px;
        text-align: center;
    }

    .referral-link {
        display: flex;
        gap: 10px;
        max-width: 600px;
        margin: 20px auto;
    }

    .referral-link input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .social-share {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    }

    .share-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        color: white;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .share-btn.facebook {
        background: #3b5998;
    }

    .share-btn.twitter {
        background: #1da1f2;
    }

    .share-btn.whatsapp {
        background: #25d366;
    }

    @media (max-width: 768px) {
        .benefits-grid,
        .earn-points-grid,
        .rewards-grid {
            grid-template-columns: 1fr;
        }

        .referral-link {
            flex-direction: column;
        }

        .social-share {
            flex-direction: column;
        }
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);