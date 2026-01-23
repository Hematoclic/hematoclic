import { SituationGrave } from '../types/situation-grave';

export const situationsGraves: SituationGrave[] = [
  {
    id: '1',
    nom: 'Syndrome de Lyse Tumorale (SLT)',
    categorie: 'Urgences métaboliques',
    niveauUrgence: 'critique',
    description: 'Le syndrome de lyse tumorale est une urgence métabolique survenant lors de la destruction massive de cellules tumorales, libérant des quantités importantes de potassium, phosphore et acide urique dans la circulation.',
    contexte: 'Survient typiquement dans les 24-48h après initiation d\'une chimiothérapie pour tumeurs à forte masse tumorale (lymphomes, leucémies aiguës). Peut aussi survenir spontanément.',
    signesCliniques: {
      symptomes: [
        'Nausées et vomissements',
        'Fatigue intense',
        'Oligurie ou anurie',
        'Troubles du rythme cardiaque',
        'Tétanie',
        'Confusion'
      ],
      signes: [
        'Hyperkaliémie (troubles du rythme, onde T pointue)',
        'Hyperphosphatémie',
        'Hyperuricémie',
        'Hypocalcémie (tétanie, prolongation QT)',
        'Insuffisance rénale aiguë',
        'Troubles du rythme cardiaque'
      ],
      signesVitaux: [
        'Troubles du rythme cardiaque (bradycardie, tachycardie, extrasystoles)',
        'Hypotension possible',
        'Tachypnée si acidose métabolique'
      ]
    },
    examensComplementaires: {
      examensUrgents: [
        'Ionogramme sanguin (K+, PO4-, Ca2+, urée, créatinine)',
        'Acide urique',
        'ECG (recherche troubles du rythme, onde T pointue)',
        'Gaz du sang (acidose métabolique)',
        'Diurèse horaire'
      ],
      valeursCritiques: [
        {
          parametre: 'Kaliémie',
          valeur: '> 6,0 mmol/L',
          interpretation: 'Hyperkaliémie sévère - risque d\'arrêt cardiaque'
        },
        {
          parametre: 'Phosphorémie',
          valeur: '> 1,5 mmol/L',
          interpretation: 'Hyperphosphatémie - risque de précipitation calcique'
        },
        {
          parametre: 'Uricémie',
          valeur: '> 600 μmol/L',
          interpretation: 'Hyperuricémie sévère - risque de néphropathie urique'
        },
        {
          parametre: 'Calcémie',
          valeur: '< 2,0 mmol/L',
          interpretation: 'Hypocalcémie - risque de tétanie et troubles du rythme'
        }
      ]
    },
    conduiteATenir: {
      mesuresImmediates: [
        'Hospitalisation en unité de soins intensifs ou hématologie',
        'Monitorage cardiaque continu',
        'Pose d\'une voie veineuse centrale si possible',
        'Début de l\'hyperhydratation (3-4 L/m²/j)',
        'Alcalinisation urinaire (bicarbonate de sodium)',
        'Allopurinol ou rasburicase'
      ],
      traitementUrgent: [
        {
          nom: 'Hyperhydratation',
          description: 'Sérum salé isotonique ou glucosé 5%',
          posologie: '3-4 L/m²/j, avec diurèse cible > 100-150 mL/h'
        },
        {
          nom: 'Alcalinisation',
          description: 'Bicarbonate de sodium 1,4%',
          posologie: '100-150 mEq/L de soluté, maintenir pH urinaire 7-8'
        },
        {
          nom: 'Rasburicase',
          description: 'Enzyme dégradant l\'acide urique',
          posologie: '0,15-0,20 mg/kg/j IV en 30 min, 1-5 jours'
        },
        {
          nom: 'Allopurinol',
          description: 'Alternative si rasburicase non disponible',
          posologie: '300-600 mg/j per os'
        },
        {
          nom: 'Traitement de l\'hyperkaliémie',
          description: 'Si K+ > 6,0 mmol/L',
          posologie: 'Calcium gluconate 10% 10-20 mL IV, insuline + glucose, résines échangeuses'
        }
      ],
      surveillance: [
        'Ionogramme toutes les 4-6h',
        'Diurèse horaire',
        'ECG continu',
        'Acide urique, créatinine, urée',
        'Signes cliniques (troubles du rythme, tétanie)'
      ],
      precautions: [
        'Ne pas alcaliniser si hyperphosphatémie sévère (risque de précipitation)',
        'Surveiller la surcharge hydrique (OAP)',
        'Dialyse si insuffisance rénale anurique ou hyperkaliémie réfractaire',
        'Prévention: évaluation du risque avant chimiothérapie, prophylaxie systématique'
      ]
    },
    complications: [
      'Insuffisance rénale aiguë',
      'Troubles du rythme cardiaque (fibrillation ventriculaire)',
      'Arrêt cardiaque',
      'Tétanie sévère',
      'Précipitation de phosphate de calcium (néphrocalcinose)'
    ],
    pronostic: 'Pronostic excellent si prise en charge précoce et adaptée. Mortalité < 1% avec traitement approprié. Pronostic réservé si retard de prise en charge ou complications rénales sévères.',
    references: [
      'Cairo MS, Bishop M. Br J Haematol 2004',
      'Howard SC, et al. Leukemia 2011'
    ],
    miseAJour: '2024-01-15'
  },
  {
    id: '2',
    nom: 'Hyperleucocytose avec Syndrome Leucémique',
    categorie: 'Urgences hématologiques',
    niveauUrgence: 'critique',
    description: 'Hyperleucocytose définie par une leucocytose > 100 G/L, pouvant entraîner des complications microvasculaires graves (leucostase) et des troubles métaboliques.',
    contexte: 'Survient principalement dans les leucémies aiguës (LAM, LAL), plus rarement dans les leucémies chroniques. Risque maximal si leucocytes > 200 G/L.',
    signesCliniques: {
      symptomes: [
        'Dyspnée',
        'Céphalées',
        'Troubles visuels',
        'Confusion, somnolence',
        'Douleurs thoraciques',
        'Signes neurologiques focaux'
      ],
      signes: [
        'Dyspnée, hypoxie',
        'Signes neurologiques (convulsions, déficit focal)',
        'Signes pulmonaires (rales, hypoxie)',
        'Signes cardiaques (insuffisance cardiaque)',
        'Pétéchies, saignements'
      ],
      signesVitaux: [
        'Hypoxie (SpO2 < 90%)',
        'Tachycardie',
        'Tachypnée',
        'Hypotension possible'
      ]
    },
    examensComplementaires: {
      examensUrgents: [
        'Hémogramme complet',
        'Gaz du sang artériel',
        'Radiographie thoracique',
        'Scanner cérébral si signes neurologiques',
        'ECG',
        'Bilan de coagulation'
      ],
      valeursCritiques: [
        {
          parametre: 'Leucocytes',
          valeur: '> 100 G/L',
          interpretation: 'Hyperleucocytose - risque de leucostase'
        },
        {
          parametre: 'Leucocytes',
          valeur: '> 200 G/L',
          interpretation: 'Hyperleucocytose majeure - urgence absolue'
        }
      ]
    },
    conduiteATenir: {
      mesuresImmediates: [
        'Hospitalisation en unité de soins intensifs',
        'Leucaphérèse (si disponible et leucocytes > 100 G/L)',
        'Hydratation IV',
        'Oxygénothérapie si hypoxie',
        'Hydroxyurée per os ou IV',
        'Chimiothérapie d\'urgence (selon type de leucémie)'
      ],
      traitementUrgent: [
        {
          nom: 'Leucaphérèse',
          description: 'Réduction mécanique de la masse leucocytaire',
          posologie: '1-2 séances, objectif réduction de 30-50%'
        },
        {
          nom: 'Hydroxyurée',
          description: 'Réduction rapide de la leucocytose',
          posologie: '50-100 mg/kg/j per os ou IV'
        },
        {
          nom: 'Chimiothérapie d\'urgence',
          description: 'Selon type de leucémie (LAM vs LAL)',
          posologie: 'Protocoles adaptés, doses réduites si nécessaire'
        },
        {
          nom: 'Transfusion plaquettaire',
          description: 'Si thrombopénie sévère et saignement',
          posologie: '1-2 concentrés plaquettaires'
        }
      ],
      surveillance: [
        'Hémogramme toutes les 6-12h',
        'Gaz du sang',
        'Monitorage neurologique',
        'Surveillance respiratoire',
        'Signes de leucostase'
      ],
      precautions: [
        'Ne pas transfuser de concentrés érythrocytaires avant leucaphérèse (risque d\'aggravation)',
        'Surveiller le syndrome de lyse tumorale après traitement',
        'Prévention des complications hémorragiques (thrombopénie)',
        'Éviter les gestes invasifs si possible'
      ]
    },
    complications: [
      'Leucostase cérébrale (AVC, convulsions)',
      'Leucostase pulmonaire (SDRA)',
      'Leucostase cardiaque',
      'Hémorragies (thrombopénie, CIVD)',
      'Syndrome de lyse tumorale après traitement'
    ],
    pronostic: 'Pronostic variable selon rapidité de prise en charge. Mortalité de 10-20% si complications de leucostase. Excellent pronostic si traitement précoce avant complications.',
    references: [
      'Porcu P, et al. Blood 2000',
      'Thiebaut A, et al. Leukemia 2016'
    ],
    miseAJour: '2024-01-20'
  },
  {
    id: '3',
    nom: 'Neutropénie Fébrile',
    categorie: 'Urgences infectieuses',
    niveauUrgence: 'urgent',
    description: 'Fièvre > 38,3°C ou > 38°C pendant > 1h chez un patient avec neutropénie < 0,5 G/L (ou < 1,0 G/L avec chute prévisible). Urgence infectieuse nécessitant une antibiothérapie empirique immédiate.',
    contexte: 'Complication fréquente de la chimiothérapie, greffe de cellules souches, ou hémopathies malignes. Mortalité élevée si retard de traitement.',
    signesCliniques: {
      symptomes: [
        'Fièvre > 38,3°C',
        'Frissons',
        'Fatigue',
        'Signes locaux d\'infection (selon site)'
      ],
      signes: [
        'Fièvre',
        'Hypotension (choc septique)',
        'Tachycardie',
        'Tachypnée',
        'Signes locaux d\'infection',
        'Éruption cutanée possible'
      ],
      signesVitaux: [
        'Température > 38,3°C',
        'Tension artérielle (hypotension si choc)',
        'Fréquence cardiaque',
        'Fréquence respiratoire',
        'SpO2'
      ]
    },
    examensComplementaires: {
      examensUrgents: [
        'Hémogramme (neutrophiles)',
        'Hémocultures (2-3 paires, périphériques + cathéter)',
        'ECBU avec cytologie',
        'Radiographie thoracique',
        'Bilan inflammatoire (CRP, PCT)',
        'Ionogramme, créatinine, LDH'
      ],
      examensSecondaires: [
        'Cultures spécifiques selon signes (cutanées, digestives)',
        'Scanner thoraco-abdomino-pelvien si fièvre persistante',
        'Ponction lombaire si signes méningés'
      ]
    },
    conduiteATenir: {
      mesuresImmediates: [
        'Hospitalisation immédiate',
        'Antibiothérapie empirique IV dans l\'heure',
        'Prélèvements bactériologiques avant antibiothérapie',
        'Évaluation du risque (MASCC score)',
        'Support hémodynamique si choc septique'
      ],
      traitementUrgent: [
        {
          nom: 'Antibiothérapie empirique standard',
          description: 'Bêta-lactamine à large spectre + aminoside',
          posologie: 'Piperacilline-tazobactam 4,5g x 3/j + amikacine 15-20 mg/kg/j, ou ceftazidime 2g x 3/j + amikacine'
        },
        {
          nom: 'Antibiothérapie à haut risque',
          description: 'Carbapénème si résistance ou patient à haut risque',
          posologie: 'Méropénème 1g x 3/j ou imipénème 500mg x 4/j'
        },
        {
          nom: 'Antifongique empirique',
          description: 'Si fièvre persistante > 96h',
          posologie: 'Caspofungine 70mg J1 puis 50mg/j, ou voriconazole'
        },
        {
          nom: 'G-CSF',
          description: 'Facteur de croissance granulocytaire',
          posologie: 'Filgrastim 5 μg/kg/j SC ou IV'
        }
      ],
      surveillance: [
        'Température toutes les 4h',
        'Hémogramme quotidien',
        'Signes vitaux',
        'Évolution clinique',
        'Résultats des cultures'
      ],
      precautions: [
        'Ne jamais retarder l\'antibiothérapie pour attendre les prélèvements',
        'Adapter selon résultats des cultures et antibiogramme',
        'Évaluer le risque de complications (choc, défaillance d\'organe)',
        'Prévention: hygiène, isolement, prophylaxie selon protocole'
      ]
    },
    complications: [
      'Choc septique',
      'Défaillance multiviscérale',
      'Infection fongique invasive',
      'Infection virale (CMV, HSV)',
      'Décès (mortalité 5-10% selon série)'
    ],
    pronostic: 'Pronostic bon avec traitement précoce (mortalité < 5%). Pronostic réservé en cas de choc septique ou infection résistante (mortalité 20-40%).',
    references: [
      'Freifeld AG, et al. Clin Infect Dis 2011',
      'Klastersky J, et al. J Clin Oncol 2000'
    ],
    miseAJour: '2024-02-01'
  },
  {
    id: '4',
    nom: 'Hémorragie Grave avec Thrombopénie',
    categorie: 'Urgences hémorragiques',
    niveauUrgence: 'critique',
    description: 'Hémorragie active sévère chez un patient avec thrombopénie, nécessitant une prise en charge urgente pour prévenir le décès par exsanguination.',
    contexte: 'Peut survenir dans les hémopathies malignes, après chimiothérapie, dans les coagulopathies, ou les thrombopénies immunes sévères.',
    signesCliniques: {
      symptomes: [
        'Saignement actif (hémorragie digestive, pulmonaire, cérébrale)',
        'Pétéchies extensives',
        'Ecchymoses spontanées',
        'Hématurie',
        'Épistaxis profuse',
        'Signes neurologiques si hémorragie cérébrale'
      ],
      signes: [
        'Hémorragie active visible',
        'Signes de choc hémorragique (pâleur, tachycardie, hypotension)',
        'Pétéchies, purpura',
        'Signes neurologiques focaux si hémorragie cérébrale',
        'Hématémèse, méléna, rectorragies'
      ],
      signesVitaux: [
        'Hypotension',
        'Tachycardie',
        'Pâleur',
        'Altération de la conscience si hémorragie cérébrale'
      ]
    },
    examensComplementaires: {
      examensUrgents: [
        'Hémogramme (plaquettes, hémoglobine)',
        'Bilan de coagulation (TP, TCA, fibrinogène)',
        'Groupe sanguin et RAI',
        'Ionogramme, créatinine',
        'Scanner cérébral si suspicion d\'hémorragie cérébrale',
        'Endoscopie digestive si hémorragie digestive'
      ],
      valeursCritiques: [
        {
          parametre: 'Plaquettes',
          valeur: '< 20 G/L',
          interpretation: 'Thrombopénie sévère - risque hémorragique majeur'
        },
        {
          parametre: 'Hémoglobine',
          valeur: '< 7 g/dL',
          interpretation: 'Anémie sévère nécessitant transfusion'
        }
      ]
    },
    conduiteATenir: {
      mesuresImmediates: [
        'Hospitalisation en unité de soins intensifs',
        'Transfusion plaquettaire immédiate',
        'Transfusion de concentrés érythrocytaires si anémie sévère',
        'Compression locale si possible',
        'Évaluation de la cause de la thrombopénie',
        'Traitement de la cause si possible'
      ],
      traitementUrgent: [
        {
          nom: 'Transfusion plaquettaire',
          description: 'Concentrés plaquettaires',
          posologie: '1-2 concentrés plaquettaires (soit 1 dose standard), objectif plaquettes > 50 G/L'
        },
        {
          nom: 'Transfusion érythrocytaire',
          description: 'Concentrés érythrocytaires',
          posologie: '2-4 concentrés selon hémoglobine et saignement actif'
        },
        {
          nom: 'Acide tranéxamique',
          description: 'Antifibrinolytique',
          posologie: '1g x 3/j IV ou 1,5g x 3/j per os'
        },
        {
          nom: 'Corticothérapie (si PTI)',
          description: 'En cas de thrombopénie immune',
          posologie: 'Méthylprednisolone 1-2 mg/kg/j IV'
        },
        {
          nom: 'IgIV (si PTI)',
          description: 'Immunoglobulines polyvalentes',
          posologie: '1-2 g/kg en 1-2 jours'
        }
      ],
      surveillance: [
        'Hémogramme toutes les 6-12h',
        'Signes vitaux',
        'Évolution du saignement',
        'Plaquettes post-transfusion (vérifier efficacité)',
        'Recherche d\'allo-immunisation anti-plaquettaire'
      ],
      precautions: [
        'Ne pas attendre les résultats biologiques pour transfuser si saignement actif',
        'Surveiller les réactions transfusionnelles',
        'Éviter les gestes invasifs',
        'Prévention: traitement préventif si thrombopénie connue'
      ]
    },
    complications: [
      'Choc hémorragique',
      'Hémorragie cérébrale (mortelle)',
      'Hémorragie digestive massive',
      'Décès par exsanguination',
      'Allo-immunisation anti-plaquettaire'
    ],
    pronostic: 'Pronostic variable selon localisation et rapidité de prise en charge. Hémorragie cérébrale: mortalité 30-50%. Hémorragie digestive: meilleur pronostic avec traitement précoce.',
    references: [
      'Stanworth SJ, et al. Blood 2015',
      'Slichter SJ. Blood 2007'
    ],
    miseAJour: '2024-01-25'
  },
  {
    id: '5',
    nom: 'Coagulopathie de Consommation (CIVD)',
    categorie: 'Urgences hémorragiques',
    niveauUrgence: 'critique',
    description: 'La coagulation intravasculaire disséminée (CIVD) est un syndrome caractérisé par une activation excessive de la coagulation, entraînant à la fois des thromboses et des hémorragies.',
    contexte: 'Peut survenir dans les leucémies aiguës (surtout LAM M3), infections sévères, choc septique, ou autres causes.',
    signesCliniques: {
      symptomes: [
        'Saignements (cutanéo-muqueux, digestifs)',
        'Signes de thrombose (ischémie, cyanose)',
        'Signes de la pathologie causale'
      ],
      signes: [
        'Pétéchies, purpura, ecchymoses',
        'Saignements multiples',
        'Cyanose des extrémités (thrombose microvasculaire)',
        'Signes d\'ischémie',
        'Signes de choc si cause infectieuse'
      ],
      signesVitaux: [
        'Hypotension possible',
        'Tachycardie',
        'Hypoxie si atteinte pulmonaire'
      ]
    },
    examensComplementaires: {
      examensUrgents: [
        'Bilan de coagulation complet (TP, TCA, fibrinogène, D-dimères)',
        'Numération plaquettaire',
        'Frottis sanguin (schizocytes)',
        'Hémogramme',
        'Bilan hépatique'
      ],
      valeursCritiques: [
        {
          parametre: 'Fibrinogène',
          valeur: '< 1,5 g/L',
          interpretation: 'Hypofibrinogénémie - signe de consommation'
        },
        {
          parametre: 'D-dimères',
          valeur: 'Très élevés',
          interpretation: 'Activation de la coagulation'
        },
        {
          parametre: 'Plaquettes',
          valeur: 'Chute rapide',
          interpretation: 'Consommation plaquettaire'
        }
      ]
    },
    conduiteATenir: {
      mesuresImmediates: [
        'Hospitalisation en unité de soins intensifs',
        'Traitement de la cause (priorité absolue)',
        'Support hémodynamique',
        'Transfusion de produits sanguins si nécessaire',
        'Héparine si forme thrombogène prédominante'
      ],
      traitementUrgent: [
        {
          nom: 'Traitement de la cause',
          description: 'Priorité absolue (chimiothérapie si LAM M3, antibiotiques si infection)',
          posologie: 'Selon pathologie causale'
        },
        {
          nom: 'Transfusion de plasma frais congelé',
          description: 'Si hémorragie active et hypofibrinogénémie',
          posologie: '15-20 mL/kg'
        },
        {
          nom: 'Transfusion plaquettaire',
          description: 'Si thrombopénie sévère et saignement',
          posologie: '1-2 concentrés plaquettaires'
        },
        {
          nom: 'Fibrinogène',
          description: 'Si fibrinogène < 1 g/L',
          posologie: '2-4 g IV'
        },
        {
          nom: 'Héparine',
          description: 'Si forme thrombogène prédominante (rare)',
          posologie: 'Héparine non fractionnée 10-15 UI/kg/h'
        }
      ],
      surveillance: [
        'Bilan de coagulation toutes les 6-12h',
        'Hémogramme',
        'Signes cliniques (saignements, thromboses)',
        'Évolution de la pathologie causale'
      ],
      precautions: [
        'Le traitement de la cause est prioritaire',
        'Éviter les gestes invasifs si possible',
        'Surveiller les complications (hémorragies, thromboses)',
        'En cas de LAM M3: acide rétinoïque (ATRA) + chimiothérapie'
      ]
    },
    complications: [
      'Hémorragies graves',
      'Thromboses (AVC, embolie pulmonaire)',
      'Défaillance multiviscérale',
      'Décès (mortalité 30-50% selon cause)'
    ],
    pronostic: 'Pronostic variable selon cause. LAM M3 avec ATRA: excellent pronostic. CIVD infectieuse: pronostic réservé (mortalité 30-50%).',
    references: [
      'Levi M, et al. Thromb Haemost 2009',
      'Taylor FB, et al. Thromb Haemost 2001'
    ],
    miseAJour: '2024-02-05'
  },
  {
    id: '6',
    nom: 'Compression Médullaire',
    categorie: 'Urgences neurologiques',
    niveauUrgence: 'critique',
    description: 'Compression de la moelle épinière par une masse tumorale (lymphome, myélome, métastases), nécessitant un traitement urgent pour préserver la fonction neurologique.',
    contexte: 'Complication des hémopathies malignes (lymphomes, myélome) ou métastases. Urgence absolue: traitement dans les 24-48h.',
    signesCliniques: {
      symptomes: [
        'Douleurs rachidiennes intenses',
        'Déficit moteur progressif (paraparésie, tétraparésie)',
        'Troubles sensitifs',
        'Troubles sphinctériens (rétention urinaire, incontinence)',
        'Douleurs radiculaires'
      ],
      signes: [
        'Déficit moteur (faiblesse des membres)',
        'Troubles sensitifs (hypoesthésie, paresthésies)',
        'Troubles sphinctériens',
        'Signes de compression (niveau sensitif)',
        'Hyperréflexie, signe de Babinski'
      ],
      signesVitaux: [
        'Douleur évaluée (EVA)',
        'Tension artérielle (autonomie possible)'
      ]
    },
    examensComplementaires: {
      examensUrgents: [
        'IRM rachidienne (urgence absolue)',
        'Scanner si IRM non disponible',
        'Radiographie rachidienne (moins sensible)',
        'Bilan biologique (hémogramme, bilan hépatique)'
      ]
    },
    conduiteATenir: {
      mesuresImmediates: [
        'Hospitalisation immédiate',
        'IRM rachidienne en urgence',
        'Consultation neurochirurgicale',
        'Consultation radiothérapeutique',
        'Début du traitement dans les 24h',
        'Corticothérapie à forte dose'
      ],
      traitementUrgent: [
        {
          nom: 'Corticothérapie',
          description: 'Dexaméthasone à forte dose',
          posologie: '16-100 mg/j IV, puis réduction progressive'
        },
        {
          nom: 'Radiothérapie',
          description: 'Radiothérapie externe sur la lésion',
          posologie: '30 Gy en 10 fractions, ou 20 Gy en 5 fractions'
        },
        {
          nom: 'Chirurgie',
          description: 'Décompression chirurgicale si indiquée',
          posologie: 'Selon évaluation neurochirurgicale'
        },
        {
          nom: 'Chimiothérapie',
          description: 'Si tumeur chimiosensible (lymphome)',
          posologie: 'Protocoles adaptés'
        }
      ],
      surveillance: [
        'Examen neurologique toutes les 4-6h',
        'Évolution du déficit moteur',
        'Fonction sphinctérienne',
        'Douleurs',
        'Imagerie de contrôle'
      ],
      precautions: [
        'Traitement dans les 24-48h maximum',
        'Pronostic fonctionnel dépend du délai de traitement',
        'Éviter les manipulations du rachis',
        'Prévention des complications (escarres, infections urinaires)'
      ]
    },
    complications: [
      'Paraplégie ou tétraplégie définitive',
      'Troubles sphinctériens permanents',
      'Douleurs chroniques',
      'Escarres',
      'Infections urinaires'
    ],
    pronostic: 'Pronostic fonctionnel dépend du délai de traitement et du déficit initial. Récupération complète possible si traitement < 24h et déficit incomplet. Récupération partielle si traitement < 48h. Récupération limitée si traitement > 48h.',
    references: [
      'Loblaw DA, et al. J Clin Oncol 2005',
      'Rades D, et al. Int J Radiat Oncol Biol Phys 2008'
    ],
    miseAJour: '2024-01-30'
  },
  {
    id: '7',
    nom: 'Anémie Aiguë Sévère avec Décompensation',
    categorie: 'Urgences hématologiques',
    niveauUrgence: 'urgent',
    description: 'Anémie aiguë sévère (Hb < 7 g/dL ou < 8 g/dL avec signes de décompensation) nécessitant une transfusion urgente.',
    contexte: 'Peut survenir dans les hémorragies aiguës, hémolyses aiguës, ou aplasies médullaires. Décompensation cardiaque ou cérébrale possible.',
    signesCliniques: {
      symptomes: [
        'Dyspnée d\'effort ou de repos',
        'Fatigue intense',
        'Palpitations',
        'Angor',
        'Vertiges, lipothymies',
        'Confusion (si anoxie cérébrale)'
      ],
      signes: [
        'Pâleur cutanéo-muqueuse',
        'Tachycardie',
        'Souffle systolique fonctionnel',
        'Signes d\'insuffisance cardiaque',
        'Signes neurologiques si anoxie cérébrale'
      ],
      signesVitaux: [
        'Tachycardie',
        'Hypotension possible',
        'Tachypnée',
        'SpO2 normale ou diminuée'
      ]
    },
    examensComplementaires: {
      examensUrgents: [
        'Hémogramme (hémoglobine, hématocrite)',
        'Groupe sanguin et RAI',
        'Bilan de coagulation si hémorragie',
        'ECG (recherche ischémie)',
        'Radiographie thoracique si signes cardiaques',
        'Bilan d\'hémolyse si suspicion'
      ],
      valeursCritiques: [
        {
          parametre: 'Hémoglobine',
          valeur: '< 7 g/dL',
          interpretation: 'Anémie sévère - indication transfusionnelle'
        },
        {
          parametre: 'Hémoglobine',
          valeur: '< 8 g/dL avec signes',
          interpretation: 'Anémie sévère avec décompensation'
        }
      ]
    },
    conduiteATenir: {
      mesuresImmediates: [
        'Hospitalisation',
        'Transfusion de concentrés érythrocytaires',
        'Oxygénothérapie si nécessaire',
        'Repos strict',
        'Recherche de la cause',
        'Traitement de la cause'
      ],
      traitementUrgent: [
        {
          nom: 'Transfusion érythrocytaire',
          description: 'Concentrés érythrocytaires',
          posologie: '2-4 concentrés selon hémoglobine et signes, objectif Hb 8-10 g/dL'
        },
        {
          nom: 'Transfusion lente',
          description: 'Si insuffisance cardiaque',
          posologie: '1 concentré sur 3-4h avec diurétique si nécessaire'
        },
        {
          nom: 'Oxygénothérapie',
          description: 'Si hypoxie',
          posologie: 'O2 nasal 2-6 L/min'
        },
        {
          nom: 'Traitement de la cause',
          description: 'Hémorragie: hémostase, hémolyse: traitement spécifique',
          posologie: 'Selon cause'
        }
      ],
      surveillance: [
        'Hémogramme post-transfusion',
        'Signes vitaux',
        'Signes de surcharge (OAP)',
        'Évolution clinique',
        'Recherche de la cause'
      ],
      precautions: [
        'Transfusion lente si insuffisance cardiaque',
        'Surveiller la surcharge volémique',
        'Éviter les transfusions excessives (objectif Hb 8-10 g/dL)',
        'Prévention: traitement préventif si anémie chronique connue'
      ]
    },
    complications: [
      'Insuffisance cardiaque aiguë',
      'Ischémie myocardique',
      'Anoxie cérébrale',
      'Surcharge volémique',
      'Réactions transfusionnelles'
    ],
    pronostic: 'Pronostic excellent avec transfusion adaptée. Pronostic réservé si décompensation cardiaque ou cérébrale sévère.',
    references: [
      'Carson JL, et al. N Engl J Med 2011',
      'Goodnough LT, et al. Blood 2012'
    ],
    miseAJour: '2024-02-10'
  },
  {
    id: '8',
    nom: 'Crise de Déglobulisation (Drépanocytose)',
    categorie: 'Urgences hématologiques',
    niveauUrgence: 'critique',
    description: 'Crise vaso-occlusive sévère ou syndrome thoracique aigu dans la drépanocytose, nécessitant une prise en charge urgente avec oxygénothérapie, hydratation et parfois exsanguino-transfusion.',
    contexte: 'Complication de la drépanocytose, pouvant être déclenchée par infection, déshydratation, hypoxie, ou facteurs environnementaux.',
    signesCliniques: {
      symptomes: [
        'Douleurs intenses (osseuses, thoraciques, abdominales)',
        'Dyspnée',
        'Fièvre',
        'Toux',
        'Signes neurologiques (AVC)'
      ],
      signes: [
        'Douleurs intenses',
        'Dyspnée, hypoxie',
        'Signes thoraciques (syndrome thoracique aigu)',
        'Signes neurologiques focaux (AVC)',
        'Ictère, splénomégalie'
      ],
      signesVitaux: [
        'Hypoxie (SpO2 < 90%)',
        'Tachycardie',
        'Tachypnée',
        'Fièvre possible'
      ]
    },
    examensComplementaires: {
      examensUrgents: [
        'Hémogramme (Hb, réticulocytes)',
        'Gaz du sang artériel',
        'Radiographie thoracique',
        'Bilan hépatique (bilirubine)',
        'Bilan inflammatoire',
        'Scanner cérébral si signes neurologiques'
      ],
      valeursCritiques: [
        {
          parametre: 'Hémoglobine',
          valeur: 'Chute rapide',
          interpretation: 'Crise de déglobulisation - risque d\'anémie sévère'
        },
        {
          parametre: 'SpO2',
          valeur: '< 90%',
          interpretation: 'Hypoxie - risque de syndrome thoracique aigu'
        }
      ]
    },
    conduiteATenir: {
      mesuresImmediates: [
        'Hospitalisation en unité de soins intensifs si sévère',
        'Oxygénothérapie (objectif SpO2 > 95%)',
        'Hydratation IV',
        'Antalgiques puissants',
        'Exsanguino-transfusion si sévère',
        'Antibiothérapie si infection'
      ],
      traitementUrgent: [
        {
          nom: 'Oxygénothérapie',
          description: 'Oxygène à haut débit',
          posologie: 'Objectif SpO2 > 95%'
        },
        {
          nom: 'Hydratation',
          description: 'Sérum salé isotonique',
          posologie: '3-4 L/m²/j'
        },
        {
          nom: 'Antalgiques',
          description: 'Morphine IV',
          posologie: 'PCA morphine ou perfusion continue'
        },
        {
          nom: 'Exsanguino-transfusion',
          description: 'Échange transfusionnel',
          posologie: 'Objectif HbS < 30%, Hb > 10 g/dL'
        },
        {
          nom: 'Antibiothérapie',
          description: 'Si infection ou syndrome thoracique aigu',
          posologie: 'Céphalosporine 3G + macrolide'
        }
      ],
      surveillance: [
        'Hémogramme',
        'Gaz du sang',
        'Signes vitaux',
        'Évolution des douleurs',
        'Signes respiratoires',
        'Signes neurologiques'
      ],
      precautions: [
        'Éviter l\'hypoxie (aggrave la drépanocytose)',
        'Surveiller la surcharge hydrique',
        'Prévention: hydroxyurée, vaccination, éviter les facteurs déclenchants',
        'Éducation du patient'
      ]
    },
    complications: [
      'Syndrome thoracique aigu (mortalité 10%)',
      'AVC',
      'Insuffisance rénale aiguë',
      'Séquestration splénique',
      'Décès'
    ],
    pronostic: 'Pronostic variable selon sévérité. Syndrome thoracique aigu: mortalité 10%. Avec traitement précoce: pronostic bon. Prévention par hydroxyurée et éducation.',
    references: [
      'Vichinsky EP, et al. N Engl J Med 2000',
      'Platt OS, et al. N Engl J Med 1994'
    ],
    miseAJour: '2024-02-15'
  }
];

