document.addEventListener('DOMContentLoaded', () => {
    const privacyManager = new PrivacyManager();
});

class PrivacyManager {
    constructor() {
        this.privacyContent = {
            section1: {
                title: "Introduction",
                content: `
                    <p>La présente politique de confidentialité décrit la manière dont EdenMarket collecte, utilise et protège vos données personnelles lors de votre utilisation de notre site web et de nos services.</p>
                    <p>Nous accordons une grande importance à la protection de votre vie privée et nous nous engageons à traiter vos données personnelles de manière transparente et sécurisée.</p>
                    <p>En utilisant notre site, vous acceptez les pratiques décrites dans cette politique de confidentialité.</p>
                `
            },
            section2: {
                title: "Données Collectées",
                content: `
                    <p>Nous collectons différents types de données personnelles, notamment :</p>
                    <ul>
                        <li>Informations d'identification (nom, prénom, adresse email)</li>
                        <li>Coordonnées (adresse postale, numéro de téléphone)</li>
                        <li>Données de paiement (numéros de carte bancaire cryptés)</li>
                        <li>Données de navigation (cookies, adresse IP)</li>
                        <li>Historique d'achats et préférences</li>
                    </ul>
                `
            },
            section3: {
                title: "Utilisation des Données",
                content: `
                    <p>Vos données personnelles sont utilisées pour :</p>
                    <ul>
                        <li>Traiter vos commandes et paiements</li>
                        <li>Gérer votre compte client</li>
                        <li>Personnaliser votre expérience d'achat</li>
                        <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                        <li>Améliorer nos services et prévenir la fraude</li>
                    </ul>
                `
            },
            section4: {
                title: "Protection des Données",
                content: `
                    <p>Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :</p>
                    <ul>
                        <li>Cryptage SSL pour les transmissions de données</li>
                        <li>Accès restreint aux données personnelles</li>
                        <li>Stockage sécurisé des données</li>
                        <li>Formation régulière de notre personnel</li>
                        <li>Audits de sécurité périodiques</li>
                    </ul>
                `
            },
            section5: {
                title: "Cookies",
                content: `
                    <p>Nous utilisons des cookies pour :</p>
                    <ul>
                        <li>Assurer le bon fonctionnement du site</li>
                        <li>Mémoriser vos préférences</li>
                        <li>Analyser le trafic du site</li>
                        <li>Personnaliser le contenu et les publicités</li>
                    </ul>
                    <p>Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur.</p>
                `
            },
            section6: {
                title: "Droits des Utilisateurs",
                content: `
                    <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                    <ul>
                        <li>Droit d'accès à vos données</li>
                        <li>Droit de rectification</li>
                        <li>Droit à l'effacement</li>
                        <li>Droit à la portabilité</li>
                        <li>Droit d'opposition au traitement</li>
                        <li>Droit de limitation du traitement</li>
                    </ul>
                `
            },
            section7: {
                title: "Partage des Données",
                content: `
                    <p>Nous pouvons partager vos données avec :</p>
                    <ul>
                        <li>Nos prestataires de services (transport, paiement)</li>
                        <li>Nos partenaires commerciaux (avec votre consentement)</li>
                        <li>Les autorités (obligation légale)</li>
                    </ul>
                    <p>Nous ne vendons jamais vos données personnelles à des tiers.</p>
                `
            },
            section8: {
                title: "Conservation des Données",
                content: `
                    <p>Nous conservons vos données :</p>
                    <ul>
                        <li>Pendant la durée de votre relation avec nous</li>
                        <li>Selon les obligations légales</li>
                        <li>Maximum 3 ans après votre dernière activité</li>
                    </ul>
                    <p>Après ces délais, vos données sont supprimées ou anonymisées.</p>
                `
            },
            section9: {
                title: "Modifications",
                content: `
                    <p>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.</p>
                    <p>Les modifications prennent effet dès leur publication sur le site.</p>
                    <p>Nous vous informerons des changements importants par email.</p>
                `
            },
            section10: {
                title: "Contact",
                content: `
                    <p>Pour toute question concernant notre politique de confidentialité :</p>
                    <ul>
                        <li>Email : privacy@edenmarket.com</li>
                        <li>Adresse : Service Protection des Données, EdenMarket, 75001 Paris</li>
                        <li>Téléphone : +33 (0)1 23 45 67 89</li>
                    </ul>
                `
            }
        };

        this.initializeContent();
        this.initializeEventListeners();
        this.setupScrollSpy();
    }

    initializeContent() {
        Object.keys(this.privacyContent).forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const contentDiv = section.querySelector('.article-content');
                contentDiv.innerHTML = this.privacyContent[sectionId].content;
            }
        });
    }

    initializeEventListeners() {
        // Download buttons
        document.getElementById('downloadPdf').addEventListener('click', () => this.downloadPolicy('pdf'));
        document.getElementById('downloadDoc').addEventListener('click', () => this.downloadPolicy('doc'));

        // Newsletter form
        document.getElementById('newsletterForm').addEventListener('submit', this.handleNewsletterSignup.bind(this));

        // Navigation links smooth scroll
        document.querySelectorAll('.privacy-nav a').forEach(link => {
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
        const navLinks = document.querySelectorAll('.privacy-nav a');
        const sections = document.querySelectorAll('.privacy-article');
        
        window.addEventListener('scroll', () => {
            const fromTop = window.scrollY + 100;

            sections.forEach(section => {
                if (
                    section.offsetTop <= fromTop &&
                    section.offsetTop + section.offsetHeight > fromTop
                ) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === section.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
    downloadPolicy(format) {
        const filename = format === 'pdf' ? 'Politique_Confidentialite_EdenMarket.pdf' : 'Politique_Confidentialite_EdenMarket.doc';
        const link = document.createElement('a');
        link.href = `path/to/${filename}`; // Remplacez par le vrai chemin du fichier
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
}

// Add these styles to your CSS
const styles = `
    .privacy-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 30px;
    }

    .privacy-nav {
        position: sticky;
        top: 20px;
        height: fit-content;
        padding: 20px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .privacy-nav ul {
        list-style: none;
        padding: 0;
    }

    .privacy-nav a {
        display: block;
        padding: 10px;
        color: #333;
        text-decoration: none;
        transition: color 0.3s;
    }

    .privacy-nav a:hover,
    .privacy-nav a.active {
        color: var(--primary-color);
    }

    .privacy-article {
        background-color: white;
        padding: 30px;
        margin-bottom: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .privacy-article h2 {
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

    .privacy-download {
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

    .privacy-contact {
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
        .privacy-content {
            grid-template-columns: 1fr;
        }

        .privacy-nav {
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