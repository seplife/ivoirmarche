document.addEventListener('DOMContentLoaded', () => {
    const cgvManager = new CGVManager();
});

class CGVManager {
    constructor() {
        this.cgvContent = {
            article1: {
                title: "Article 1 - Objet",
                content: `
                    <p>Les présentes Conditions Générales de Vente (CGV) déterminent les droits et obligations des parties dans le cadre de la vente en ligne de produits proposés par EdenMarket.</p>
                    <p>Les présentes CGV régissent toutes les ventes de produits conclues via le site Internet EdenMarket.com et sont partie intégrante du contrat entre l'acheteur et le vendeur.</p>
                    <p>Le vendeur se réserve la possibilité de modifier à tout moment les présentes conditions générales de vente.</p>
                `
            },
            article2: {
                title: "Article 2 - Prix",
                content: `
                    <p>Les prix de nos produits sont indiqués en euros (€) toutes taxes comprises (TTC).</p>
                    <p>Les frais de livraison sont indiqués avant validation de la commande.</p>
                    <p>EdenMarket se réserve le droit de modifier ses prix à tout moment, les produits étant facturés sur la base des tarifs en vigueur au moment de l'enregistrement de la commande.</p>
                `
            },
            article3: {
                title: "Article 3 - Commandes",
                content: `
                    <p>L'acheteur qui souhaite acheter un produit doit :</p>
                    <ul>
                        <li>Sélectionner le ou les produits</li>
                        <li>Remplir le formulaire de commande</li>
                        <li>Valider sa commande après l'avoir vérifiée</li>
                        <li>Effectuer le paiement</li>
                    </ul>
                    <p>La confirmation de la commande entraîne acceptation des présentes CGV et forme le contrat.</p>
                `
            },
            article4: {
                title: "Article 4 - Paiement",
                content: `
                    <p>Le paiement est exigible immédiatement à la commande. L'acheteur peut effectuer le règlement par :</p>
                    <ul>
                        <li>Carte bancaire</li>
                        <li>Orange Money</li>
                        <li>MTN Money</li>
                        <li>Moov Money</li>
                        <li>Wave</li>
                        <li>PayPal</li>
                    </ul>
                    <p>Les paiements par carte bancaire sont sécurisés par le protocole SSL.</p>
                `
            },
            article5: {
                title: "Article 5 - Livraison",
                content: `
                    <p>Les délais de livraison sont donnés à titre indicatif. Ils peuvent varier selon :</p>
                    <ul>
                        <li>La destination</li>
                        <li>Le mode de livraison choisi</li>
                        <li>La disponibilité des produits</li>
                    </ul>
                    <p>En cas de retard de livraison de plus de 7 jours, le client peut annuler sa commande.</p>
                `
            },
            article6: {
                title: "Article 6 - Retours",
                content: `
                    <p>Le client dispose d'un délai de 14 jours à compter de la réception pour retourner un produit.</p>
                    <p>Conditions de retour :</p>
                    <ul>
                        <li>Produit dans son état d'origine</li>
                        <li>Emballage intact</li>
                        <li>Avec tous les accessoires</li>
                    </ul>
                    <p>Les frais de retour sont à la charge du client sauf produit défectueux.</p>
                `
            },
            article7: {
                title: "Article 7 - Garanties",
                content: `
                    <p>Tous nos produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés.</p>
                    <p>En cas de non-conformité d'un produit vendu, il pourra être retourné au vendeur qui le reprendra, l'échangera ou le remboursera.</p>
                    <p>Toutes les réclamations doivent être effectuées par voie postale ou par email.</p>
                `
            },
            article8: {
                title: "Article 8 - Responsabilité",
                content: `
                    <p>Le vendeur ne peut être tenu responsable :</p>
                    <ul>
                        <li>Des dommages de toute nature résultant d'une mauvaise utilisation</li>
                        <li>De l'indisponibilité temporaire du site</li>
                        <li>De la perte de données</li>
                    </ul>
                    <p>La responsabilité du vendeur est limitée au montant de la commande.</p>
                `
            },
            article9: {
                title: "Article 9 - Données Personnelles",
                content: `
                    <p>EdenMarket s'engage à protéger les données personnelles de ses clients.</p>
                    <p>Les informations collectées sont :</p>
                    <ul>
                        <li>Nom et prénom</li>
                        <li>Adresse email</li>
                        <li>Adresse postale</li>
                        <li>Numéro de téléphone</li>
                    </ul>
                    <p>Ces données sont utilisées uniquement pour le traitement des commandes et la communication avec le client.</p>
                `
            },
            article10: {
                title: "Article 10 - Droit Applicable",
                content: `
                    <p>Les présentes CGV sont soumises au droit français.</p>
                    <p>En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.</p>
                    <p>En cas d'échec de la conciliation, le tribunal de commerce de Paris sera seul compétent.</p>
                `
            }
        };

        this.initializeContent();
        this.initializeEventListeners();
        this.setupScrollSpy();
    }

    initializeContent() {
        Object.keys(this.cgvContent).forEach(articleId => {
            const article = document.getElementById(articleId);
            if (article) {
                const contentDiv = article.querySelector('.article-content');
                contentDiv.innerHTML = this.cgvContent[articleId].content;
            }
        });
    }

    initializeEventListeners() {
        // Download buttons
        document.getElementById('downloadPdf').addEventListener('click', () => this.downloadCGV('pdf'));
        document.getElementById('downloadDoc').addEventListener('click', () => this.downloadCGV('doc'));

        // Newsletter form
        document.getElementById('newsletterForm').addEventListener('submit', this.handleNewsletterSignup.bind(this));

        // Navigation links smooth scroll
        document.querySelectorAll('.cgv-nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupScrollSpy() {
        const navLinks = document.querySelectorAll('.cgv-nav a');
        const articles = document.querySelectorAll('.cgv-article');
        
        window.addEventListener('scroll', () => {
            const fromTop = window.scrollY + 100;

            articles.forEach(article => {
                if (
                    article.offsetTop <= fromTop &&
                    article.offsetTop + article.offsetHeight > fromTop
                ) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === article.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    downloadCGV(format) {
        // Simulate download
        const filename = format === 'pdf' ? 'CGV_EdenMarket.pdf' : 'CGV_EdenMarket.doc';
        alert(`Téléchargement du fichier ${filename} en cours...`);
        
        // In a real implementation, this would trigger an actual file download
        // You would typically make an API call to get the file
    }

    handleNewsletterSignup(event) {
        event.preventDefault();
        const email = event.target.querySelector('input').value;
        alert(`Merci de vous être inscrit avec l'email : ${email}`);
        event.target.reset();
    }
}

// Add these styles to your CSS
const styles = `
    .cgv-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 30px;
    }

    .cgv-nav {
        position: sticky;
        top: 20px;
        height: fit-content;
        padding: 20px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .cgv-nav ul {
        list-style: none;
        padding: 0;
    }

    .cgv-nav a {
        display: block;
        padding: 10px;
        color: #333;
        text-decoration: none;
        transition: color 0.3s;
    }

    .cgv-nav a:hover,
    .cgv-nav a.active {
        color: var(--primary-color);
    }

    .cgv-article {
        background-color: white;
        padding: 30px;
        margin-bottom: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .cgv-article h2 {
        color: var(--primary-color);
        margin-bottom: 20px;
    }

    .article-content {
        line-height: 1.6;
    }

    .article-content ul {
        padding-left: 20px;
        margin: 10px 0;
    }

    .cgv-download {
        text-align: center;
        padding: 40px 20px;
        background-color: white;
        margin-top: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .download-options {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
    }

    .download-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 30px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .download-btn:hover {
        background-color: var(--secondary-color);
    }

    .cgv-contact {
        text-align: center;
        padding: 40px 20px;
        background-color: #f8f8f8;
        margin-top: 30px;
    }

    .contact-btn {
        display: inline-block;
        padding: 15px 30px;
        margin-top: 20px;
        background-color: var(--primary-color);
        color: white;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    .contact-btn:hover {
        background-color: var(--secondary-color);
    }

    @media (max-width: 768px) {
        .cgv-content {
            grid-template-columns: 1fr;
        }

        .cgv-nav {
            position: relative;
            top: 0;
        }

        .download-options {
            flex-direction: column;
            align-items: center;
        }
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);