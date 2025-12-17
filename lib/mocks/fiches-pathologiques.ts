import { FichePathologique } from '../types/fiche-pathologique';

export const fichesPathologiques: FichePathologique[] = [
  {
    id: '1',
    nom: 'Leucémie Aiguë Myéloïde (LAM)',
    categorie: 'Hémopathies malignes',
    description: 'La leucémie aiguë myéloïde est une hémopathie maligne caractérisée par la prolifération clonale de cellules myéloïdes immatures bloquées à un stade précoce de différenciation.',
    caracteristiquesCliniques: {
      symptomes: [
        'Fatigue intense et asthénie',
        'Fièvre et infections récurrentes',
        'Saignements (épistaxis, gingivorragies, ecchymoses)',
        'Pétéchies',
        'Douleurs osseuses',
        'Adénopathies',
        'Hépatosplénomégalie'
      ],
      signes: [
        'Anémie (pâleur, dyspnée)',
        'Thrombopénie (saignements)',
        'Neutropénie (infections)',
        'Syndrome tumoral (adénopathies, hépatosplénomégalie)',
        'Syndrome leucémique (hyperleucocytose)'
      ],
      presentation: 'Apparition brutale en quelques semaines, souvent chez l\'adulte de plus de 60 ans, mais peut survenir à tout âge.',
      evolution: 'Évolution rapidement fatale en l\'absence de traitement. Avec traitement, taux de rémission complète de 60-80% selon les sous-types.'
    },
    caracteristiquesBiologiques: {
      hemogramme: {
        description: 'Anomalies quantitatives et qualitatives des cellules sanguines',
        anomalies: [
          'Anémie normochrome normocytaire',
          'Thrombopénie < 100 G/L',
          'Neutropénie < 1,5 G/L',
          'Blastes circulants (variable, parfois absents)',
          'Hyperleucocytose possible (> 100 G/L)'
        ]
      },
      marqueurs: [
        'Blastes médullaires ≥ 20%',
        'Cytogénétique: t(8;21), t(15;17), inv(16), anomalies complexes',
        'Immunophénotypage: CD13+, CD33+, CD117+, MPO+',
        'Mutations: FLT3, NPM1, CEBPA'
      ],
      examensComplementaires: [
        'Myélogramme (blastes ≥ 20%)',
        'Caryotype médullaire',
        'Biologie moléculaire (mutations)',
        'Immunophénotypage',
        'Ponction lombaire (évaluation méningée)'
      ],
      criteresDiagnostiques: [
        'Présence de ≥ 20% de blastes dans la moelle osseuse',
        'Ou présence de blastes circulants avec anomalies cytogénétiques spécifiques',
        'Classification OMS selon immunophénotype et cytogénétique'
      ]
    },
    caracteristiquesTherapeutiques: {
      traitementPremiereLigne: [
        'Chimiothérapie d\'induction: protocole "3+7" (daunorubicine + cytarabine)',
        'Chimiothérapie de consolidation',
        'Allogreffe de cellules souches hématopoïétiques pour patients à haut risque'
      ],
      traitementDeuxiemeLigne: [
        'Chimiothérapie de rattrapage',
        'Thérapies ciblées (inhibiteurs de FLT3, IDH1/IDH2)',
        'Immunothérapie (gemtuzumab ozogamycine)'
      ],
      protocoles: [
        {
          nom: 'Protocole 3+7',
          description: 'Daunorubicine 60-90 mg/m²/j J1-3 + Cytarabine 100-200 mg/m²/j J1-7',
          indications: ['LAM de novo', 'Patients < 60 ans', 'PS 0-2']
        },
        {
          nom: 'Protocole FLAG-IDA',
          description: 'Fludarabine + Cytarabine + G-CSF + Idarubicine',
          indications: ['LAM en rechute', 'LAM réfractaire']
        }
      ],
      suivi: [
        'Myélogramme à J15, J28, puis mensuel',
        'Évaluation de la rémission complète (blastes < 5%)',
        'Surveillance cytogénétique et moléculaire',
        'Ponction lombaire systématique'
      ],
      pronostic: 'Pronostic variable selon cytogénétique: favorable (t(8;21), inv(16), t(15;17)) vs défavorable (anomalies complexes, -7, -5). Survie globale à 5 ans: 25-40%.'
    },
    references: [
      'Döhner H, et al. Blood 2017',
      'NCCN Guidelines AML 2024'
    ],
    miseAJour: '2024-01-15'
  },
  {
    id: '2',
    nom: 'Leucémie Aiguë Lymphoblastique (LAL)',
    categorie: 'Hémopathies malignes',
    description: 'La leucémie aiguë lymphoblastique est une hémopathie maligne caractérisée par la prolifération de précurseurs lymphoïdes B ou T bloqués à un stade précoce de différenciation.',
    caracteristiquesCliniques: {
      symptomes: [
        'Fatigue et asthénie',
        'Fièvre',
        'Saignements (pétéchies, ecchymoses)',
        'Douleurs osseuses et articulaires',
        'Adénopathies',
        'Hépatosplénomégalie',
        'Signes neurologiques (LAL avec atteinte méningée)'
      ],
      signes: [
        'Anémie',
        'Thrombopénie',
        'Neutropénie',
        'Hyperleucocytose fréquente',
        'Syndrome tumoral',
        'Méningite leucémique (céphalées, vomissements)'
      ],
      presentation: 'Plus fréquente chez l\'enfant (80% des leucémies pédiatriques), mais peut survenir chez l\'adulte (20% des leucémies aiguës adultes).',
      evolution: 'Pronostic excellent chez l\'enfant (taux de guérison > 90%), plus réservé chez l\'adulte (taux de guérison 40-50%).'
    },
    caracteristiquesBiologiques: {
      hemogramme: {
        description: 'Anomalies hématologiques avec présence de blastes lymphoïdes',
        anomalies: [
          'Anémie',
          'Thrombopénie',
          'Neutropénie',
          'Hyperleucocytose fréquente (50-100 G/L)',
          'Blastes lymphoïdes circulants',
          'Lymphoblastes médullaires ≥ 20%'
        ]
      },
      marqueurs: [
        'Blastes médullaires ≥ 20%',
        'Immunophénotype: LAL-B (CD19+, CD10+, CD20±) ou LAL-T (CD3+, CD7+)',
        'Cytogénétique: t(9;22) Philadelphia, t(12;21), hyperdiploïdie',
        'Biologie moléculaire: BCR-ABL1, ETV6-RUNX1'
      ],
      examensComplementaires: [
        'Myélogramme',
        'Immunophénotypage (distinction B/T)',
        'Caryotype et FISH',
        'Biologie moléculaire',
        'Ponction lombaire (évaluation méningée obligatoire)'
      ],
      criteresDiagnostiques: [
        'Présence de ≥ 20% de lymphoblastes dans la moelle osseuse',
        'Classification selon immunophénotype (B ou T)',
        'Évaluation du risque selon cytogénétique et réponse précoce'
      ]
    },
    caracteristiquesTherapeutiques: {
      traitementPremiereLigne: [
        'Chimiothérapie d\'induction (vincristine, prednisone, L-asparaginase, anthracyclines)',
        'Chimiothérapie de consolidation',
        'Chimiothérapie d\'entretien (mercaptopurine, méthotrexate)',
        'Prophylaxie méningée (chimiothérapie intrathécale)',
        'Allogreffe pour patients à haut risque'
      ],
      traitementDeuxiemeLigne: [
        'Chimiothérapie de rattrapage',
        'Immunothérapie (blinatumomab, inotuzumab)',
        'Thérapie cellulaire CAR-T',
        'Allogreffe'
      ],
      protocoles: [
        {
          nom: 'Protocole pédiatrique (ex: FRALLE)',
          description: 'Induction, consolidation, entretien sur 2-3 ans',
          indications: ['LAL pédiatrique', 'Risque standard ou élevé']
        },
        {
          nom: 'Protocole adulte (ex: GRAALL)',
          description: 'Protocole intensifié type pédiatrique adapté à l\'adulte',
          indications: ['LAL adulte < 60 ans', 'PS 0-2']
        }
      ],
      suivi: [
        'Myélogramme à J15, J28, puis régulier',
        'Évaluation de la maladie résiduelle minimale (MRD)',
        'Ponctions lombaires répétées',
        'Surveillance cytogénétique et moléculaire'
      ],
      pronostic: 'Pronostic excellent chez l\'enfant (90% de guérison). Chez l\'adulte: 40-50% de guérison. Facteurs pronostiques: âge, leucocytose initiale, cytogénétique, réponse précoce, MRD.'
    },
    references: [
      'Pui CH, et al. Lancet 2008',
      'Bassan R, et al. Blood 2010'
    ],
    miseAJour: '2024-02-01'
  },
  {
    id: '3',
    nom: 'Lymphome de Hodgkin',
    categorie: 'Lymphomes',
    description: 'Le lymphome de Hodgkin est un lymphome caractérisé par la présence de cellules de Reed-Sternberg dans un environnement inflammatoire riche.',
    caracteristiquesCliniques: {
      symptomes: [
        'Adénopathies cervicales ou médiastinales',
        'Symptômes B: fièvre > 38°C, sueurs nocturnes, perte de poids > 10%',
        'Prurit',
        'Douleur ganglionnaire après consommation d\'alcool (rare)',
        'Fatigue'
      ],
      signes: [
        'Adénopathies périphériques (cervicales, axillaires, inguinales)',
        'Adénopathies médiastinales (visible sur radiographie thoracique)',
        'Splénomégalie possible',
        'Hépatomégalie rare'
      ],
      presentation: 'Pic d\'incidence chez l\'adulte jeune (20-30 ans) et après 50 ans. Présentation classique: adénopathies cervicales indolores.',
      evolution: 'Pronostic excellent avec traitement moderne (taux de guérison > 90% tous stades confondus).'
    },
    caracteristiquesBiologiques: {
      hemogramme: {
        description: 'Anomalies non spécifiques possibles',
        anomalies: [
          'Anémie inflammatoire possible',
          'Neutrophilie',
          'Lymphopénie (facteur pronostique défavorable)',
          'Éosinophilie possible',
          'Thrombocytose'
        ]
      },
      marqueurs: [
        'Cellules de Reed-Sternberg (CD30+, CD15+, CD20±)',
        'Classification: nodulaire sclérosant (80%), cellularité mixte, riche en lymphocytes, déplétion lymphocytaire',
        'EBV+ dans 40% des cas (surtout cellularité mixte)'
      ],
      examensComplementaires: [
        'Biopsie ganglionnaire (diagnostic histologique)',
        'TDM thoraco-abdomino-pelvien',
        'TEP-scan (staging et évaluation de réponse)',
        'Biopsie ostéomédullaire (si stade avancé)',
        'Sérologie EBV'
      ],
      criteresDiagnostiques: [
        'Présence de cellules de Reed-Sternberg sur biopsie',
        'Classification selon l\'OMS (4 sous-types classiques + LNHG nodulaire à prédominance lymphocytaire)',
        'Staging selon Ann Arbor (I à IV)'
      ]
    },
    caracteristiquesTherapeutiques: {
      traitementPremiereLigne: [
        'Stades I-II favorables: ABVD x 2-4 cycles + radiothérapie',
        'Stades I-II défavorables: ABVD x 4 cycles + radiothérapie',
        'Stades III-IV: ABVD x 6 cycles ou BEACOPP escaladé',
        'Radiothérapie sur sites initialement volumineux'
      ],
      traitementDeuxiemeLigne: [
        'Chimiothérapie de rattrapage (ICE, DHAP)',
        'Autogreffe de cellules souches',
        'Brentuximab vedotin',
        'Immunothérapie (nivolumab, pembrolizumab)'
      ],
      protocoles: [
        {
          nom: 'ABVD',
          description: 'Doxorubicine, Bléomycine, Vinblastine, Dacarbazine',
          indications: ['Stades I-IV', 'Traitement standard']
        },
        {
          nom: 'BEACOPP escaladé',
          description: 'Bleomycine, Etoposide, Doxorubicine, Cyclophosphamide, Vincristine, Procarbazine, Prednisone',
          indications: ['Stades avancés', 'Patients jeunes']
        }
      ],
      suivi: [
        'TEP-scan à mi-traitement (évaluation précoce)',
        'TEP-scan post-traitement',
        'Surveillance clinique et TDM tous les 3-6 mois les 2 premières années',
        'Surveillance à long terme (risque de second cancer, complications cardiaques)'
      ],
      pronostic: 'Excellent pronostic: taux de guérison > 90%. Facteurs pronostiques: stade, symptômes B, volume tumoral, sédimentation, âge.'
    },
    references: [
      'Connors JM, et al. N Engl J Med 2018',
      'ESMO Guidelines 2023'
    ],
    miseAJour: '2024-01-20'
  },
  {
    id: '4',
    nom: 'Lymphome Non Hodgkinien à grandes cellules B',
    categorie: 'Lymphomes',
    description: 'Le lymphome non hodgkinien à grandes cellules B (LNHGCB) est le lymphome le plus fréquent chez l\'adulte, caractérisé par une prolifération de grandes cellules B matures.',
    caracteristiquesCliniques: {
      symptomes: [
        'Adénopathies périphériques',
        'Symptômes B: fièvre, sueurs nocturnes, perte de poids',
        'Masse médiastinale (dyspnée, syndrome cave supérieur)',
        'Atteinte extra-ganglionnaire (estomac, intestin, système nerveux central)',
        'Fatigue'
      ],
      signes: [
        'Adénopathies',
        'Hépatosplénomégalie',
        'Masse abdominale',
        'Signes d\'insuffisance médullaire si atteinte osseuse'
      ],
      presentation: 'Incidence maximale après 60 ans. Présentation variable selon localisation: ganglionnaire, extra-ganglionnaire, ou disséminée.',
      evolution: 'Pronostic variable selon IPI (International Prognostic Index): 5 ans de survie de 30% (IPI élevé) à 80% (IPI faible).'
    },
    caracteristiquesBiologiques: {
      hemogramme: {
        description: 'Anomalies possibles selon localisation',
        anomalies: [
          'Anémie possible',
          'Thrombopénie si atteinte médullaire',
          'Lactate déshydrogénase (LDH) élevée (facteur pronostique)',
          'Bêta-2-microglobuline élevée'
        ]
      },
      marqueurs: [
        'CD20+, CD79a+, PAX5+',
        'Sous-types: centroblastique, immunoblastique, anaplasique',
        'Double hit/triple hit (MYC, BCL2, BCL6) = pronostic défavorable',
        'EBV+ possible (chez sujet âgé)'
      ],
      examensComplementaires: [
        'Biopsie ganglionnaire ou extra-ganglionnaire',
        'Immunohistochimie',
        'TDM thoraco-abdomino-pelvien',
        'TEP-scan',
        'Biopsie ostéomédullaire',
        'Ponction lombaire si localisations à risque'
      ],
      criteresDiagnostiques: [
        'Diagnostic histologique sur biopsie',
        'Classification selon l\'OMS (LNHGCB diffus, primitif du médiastin, etc.)',
        'Staging selon Ann Arbor',
        'Calcul de l\'IPI (âge, LDH, PS, stade, sites extra-ganglionnaires)'
      ]
    },
    caracteristiquesTherapeutiques: {
      traitementPremiereLigne: [
        'R-CHOP: Rituximab + Cyclophosphamide, Doxorubicine, Vincristine, Prednisone',
        '6 cycles pour stades I-II',
        '6-8 cycles pour stades III-IV',
        'Radiothérapie consolidative sur sites initialement volumineux'
      ],
      traitementDeuxiemeLigne: [
        'Chimiothérapie de rattrapage (R-ICE, R-DHAP)',
        'Autogreffe de cellules souches',
        'CAR-T cells (axicabtagene ciloleucel, tisagenlecleucel)',
        'Polatuzumab vedotin + R-CHP'
      ],
      protocoles: [
        {
          nom: 'R-CHOP',
          description: 'Rituximab 375 mg/m² J1 + CHOP J1, cycles de 21 jours',
          indications: ['LNHGCB standard', 'Stades I-IV']
        },
        {
          nom: 'R-ICE',
          description: 'Rituximab + Ifosfamide, Carboplatine, Etoposide',
          indications: ['LNHGCB en rechute', 'Avant autogreffe']
        }
      ],
      suivi: [
        'TEP-scan post-traitement (évaluation de réponse)',
        'Surveillance clinique tous les 3 mois les 2 premières années',
        'TDM si suspicion de rechute',
        'Surveillance à long terme'
      ],
      pronostic: 'Pronostic selon IPI: IPI 0-1 (survie à 5 ans 80%), IPI 2 (66%), IPI 3 (54%), IPI 4-5 (32%). Double hit/triple hit = pronostic défavorable.'
    },
    references: [
      'Coiffier B, et al. N Engl J Med 2002',
      'NCCN Guidelines DLBCL 2024'
    ],
    miseAJour: '2024-02-10'
  },
  {
    id: '5',
    nom: 'Myélome Multiple',
    categorie: 'Hémopathies malignes',
    description: 'Le myélome multiple est une hémopathie maligne caractérisée par la prolifération de plasmocytes dans la moelle osseuse, associée à une production d\'immunoglobuline monoclonale.',
    caracteristiquesCliniques: {
      symptomes: [
        'Douleurs osseuses (colonne vertébrale, côtes, bassin)',
        'Fatigue et asthénie',
        'Infections récurrentes',
        'Troubles neurologiques (compression médullaire)',
        'Insuffisance rénale',
        'Hypercalcémie (confusion, polyurie)'
      ],
      signes: [
        'Anémie',
        'Insuffisance rénale',
        'Hypercalcémie',
        'Lésions osseuses lytiques',
        'Fractures pathologiques',
        'Amylose possible'
      ],
      presentation: 'Maladie de l\'adulte âgé (âge médian 70 ans). Présentation classique: douleurs osseuses + anémie + insuffisance rénale.',
      evolution: 'Maladie incurable mais traitement efficace. Médiane de survie: 5-7 ans avec traitement moderne, jusqu\'à 10 ans pour certains patients.'
    },
    caracteristiquesBiologiques: {
      hemogramme: {
        description: 'Anémie fréquente, autres cytopénies possibles',
        anomalies: [
          'Anémie normochrome normocytaire (80% des cas)',
          'Thrombopénie possible',
          'Neutropénie possible',
          'Rouleaux érythrocytaires (agrégation)'
        ]
      },
      marqueurs: [
        'Immunoglobuline monoclonale (IgG, IgA, ou chaînes légères)',
        'Chaînes légères libres (kappa ou lambda)',
        'Plasmocytes médullaires ≥ 10%',
        'Cytogénétique: del(17p), t(4;14), t(14;16) = haut risque',
        'Bêta-2-microglobuline, albumine (staging R-ISS)'
      ],
      examensComplementaires: [
        'Électrophorèse des protéines sériques et urinaires',
        'Immunofixation',
        'Dosage des chaînes légères libres',
        'Myélogramme',
        'Radiographies du squelette (ou TDM low-dose)',
        'IRM rachis si symptômes neurologiques',
        'Caryotype et FISH médullaire'
      ],
      criteresDiagnostiques: [
        'Critères CRAB: C (calcémie élevée), R (insuffisance rénale), A (anémie), B (lésions osseuses)',
        'Ou critères SLiM: 60% de plasmocytes médullaires, ratio chaînes légères > 100, > 1 lésion IRM',
        'Staging selon R-ISS (Revised International Staging System)'
      ]
    },
    caracteristiquesTherapeutiques: {
      traitementPremiereLigne: [
        'Patients éligibles à autogreffe: VRd (Vélcade, Revlimid, dexaméthasone) ou KRd',
        'Patients non éligibles: VRd-lite ou DRd (Darzalex, Revlimid, dexaméthasone)',
        'Autogreffe de cellules souches après induction',
        'Traitement de maintenance (Revlimid)'
      ],
      traitementDeuxiemeLigne: [
        'Daratumumab + pomalidomide + dexaméthasone',
        'Carfilzomib + dexaméthasone',
        'Selinexor + dexaméthasone',
        'CAR-T cells (ciltacabtagene autoleucel)',
        'Anticorps bispécifiques'
      ],
      protocoles: [
        {
          nom: 'VRd',
          description: 'Vélcade (bortézomib) + Revlimid (lénalidomide) + dexaméthasone',
          indications: ['Première ligne', 'Patients éligibles ou non éligibles à autogreffe']
        },
        {
          nom: 'DRd',
          description: 'Darzalex (daratumumab) + Revlimid + dexaméthasone',
          indications: ['Première ligne', 'Patients non éligibles à autogreffe']
        }
      ],
      suivi: [
        'Évaluation de réponse selon IMWG (International Myeloma Working Group)',
        'Surveillance de la protéine monoclonale (électrophorèse)',
        'Surveillance des chaînes légères libres',
        'Myélogramme si suspicion de progression',
        'Imagerie osseuse si symptômes'
      ],
      pronostic: 'Pronostic variable selon R-ISS: R-ISS I (survie médiane non atteinte), R-ISS II (survie médiane 83 mois), R-ISS III (survie médiane 43 mois). Facteurs de mauvais pronostic: del(17p), t(4;14), t(14;16).'
    },
    references: [
      'Rajkumar SV, et al. Lancet 2014',
      'IMWG Guidelines 2024'
    ],
    miseAJour: '2024-01-25'
  },
  {
    id: '6',
    nom: 'Anémie Ferriprive',
    categorie: 'Anémies',
    description: 'L\'anémie ferriprive est une anémie microcytaire hypochrome due à une carence en fer, le plus souvent secondaire à des pertes sanguines chroniques.',
    caracteristiquesCliniques: {
      symptomes: [
        'Fatigue et asthénie',
        'Dyspnée d\'effort',
        'Palpitations',
        'Céphalées',
        'Vertiges',
        'Pica (envie de substances non alimentaires)',
        'Syndrome des jambes sans repos'
      ],
      signes: [
        'Pâleur cutanéo-muqueuse',
        'Koïlonychie (ongles en cuiller)',
        'Chéilite angulaire',
        'Glossite atrophique',
        'Souffle systolique fonctionnel',
        'Tachycardie'
      ],
      presentation: 'Fréquente, surtout chez la femme en âge de procréer (ménorragies) et chez l\'adulte âgé (saignements digestifs).',
      evolution: 'Guérison complète avec correction de la carence et traitement de la cause.'
    },
    caracteristiquesBiologiques: {
      hemogramme: {
        description: 'Anémie microcytaire hypochrome',
        anomalies: [
          'Hémoglobine abaissée',
          'VGM < 80 fL (microcytose)',
          'CCMH < 32% (hypochromie)',
          'TCMH < 27 pg',
          'Réticulocytes normaux ou légèrement augmentés'
        ]
      },
      marqueurs: [
        'Ferritine < 15-30 ng/mL (selon contexte)',
        'Fer sérique abaissé',
        'Capacité totale de fixation du fer (CTFF) augmentée',
        'Coefficient de saturation de la transferrine < 16%',
        'Récepteur soluble de la transferrine augmenté'
      ],
      examensComplementaires: [
        'Bilan martial complet (ferritine, fer sérique, CTFF)',
        'Recherche de saignement digestif (hémoccult, coloscopie, gastroscopie)',
        'Recherche de saignement gynécologique (chez la femme)',
        'Bilan inflammatoire (CRP) pour interpréter la ferritine'
      ],
      criteresDiagnostiques: [
        'Anémie microcytaire hypochrome',
        'Ferritine < 15-30 ng/mL (ou < 50-100 ng/mL si inflammation)',
        'Coefficient de saturation < 16%',
        'Réponse au traitement martial'
      ]
    },
    caracteristiquesTherapeutiques: {
      traitementPremiereLigne: [
        'Sulfate ferreux 200 mg/j (ou équivalent)',
        'Prise à jeun pour meilleure absorption',
        'Durée: 3-6 mois après normalisation de l\'Hb',
        'Surveillance de la tolérance digestive'
      ],
      traitementDeuxiemeLigne: [
        'Fer par voie parentérale (si intolérance digestive ou malabsorption)',
        'Transfusion si anémie sévère symptomatique'
      ],
      protocoles: [
        {
          nom: 'Traitement oral standard',
          description: 'Sulfate ferreux 200 mg/j (65 mg de fer élémentaire)',
          indications: ['Anémie ferriprive', 'Tolérance digestive correcte']
        },
        {
          nom: 'Fer intraveineux',
          description: 'Fer carboxymaltose ou fer sucrose',
          indications: ['Intolérance digestive', 'Malabsorption', 'Anémie sévère']
        }
      ],
      suivi: [
        'Hémogramme à 1 mois (vérifier réponse)',
        'Hémogramme à 3 mois (normalisation attendue)',
        'Ferritine à 3-6 mois',
        'Recherche et traitement de la cause (saignements)'
      ],
      pronostic: 'Excellent. Guérison complète avec traitement. Pronostic dépend de la cause sous-jacente (saignement digestif malin vs bénin).'
    },
    references: [
      'Camaschella C. N Engl J Med 2015',
      'Haute Autorité de Santé - Anémie 2011'
    ],
    miseAJour: '2024-02-05'
  },
  {
    id: '7',
    nom: 'Thrombopénie Immune (PTI)',
    categorie: 'Pathologies plaquettaires',
    description: 'La thrombopénie immune (PTI) est une maladie auto-immune caractérisée par une destruction périphérique des plaquettes par des auto-anticorps, en l\'absence d\'autre cause identifiée.',
    caracteristiquesCliniques: {
      symptomes: [
        'Saignements cutanéo-muqueux (pétéchies, ecchymoses)',
        'Épistaxis',
        'Gingivorragies',
        'Ménorragies',
        'Hémorragies digestives (rare)',
        'Hémorragies cérébrales (exceptionnel, < 1%)'
      ],
      signes: [
        'Pétéchies',
        'Ecchymoses spontanées',
        'Purpura',
        'Saignements muqueux',
        'Splénomégalie absente (critère diagnostique)'
      ],
      presentation: 'Deux pics: enfants (guérison spontanée fréquente) et adultes jeunes (surtout femmes). Présentation aiguë ou chronique.',
      evolution: 'Chez l\'enfant: guérison spontanée dans 80% des cas. Chez l\'adulte: évolution chronique dans 70% des cas.'
    },
    caracteristiquesBiologiques: {
      hemogramme: {
        description: 'Thrombopénie isolée',
        anomalies: [
          'Plaquettes < 100 G/L (souvent < 50 G/L)',
          'Hémogramme par ailleurs normal',
          'Pas d\'anomalie des autres lignées',
          'Volume plaquettaire moyen (VPM) souvent augmenté'
        ]
      },
      marqueurs: [
        'Anticorps anti-plaquettes (non systématique)',
        'Myélogramme: mégacaryocytes normaux ou augmentés',
        'Absence d\'autres anomalies médullaires'
      ],
      examensComplementaires: [
        'Hémogramme complet',
        'Frottis sanguin (vérifier absence de schizocytes)',
        'Myélogramme (si doute diagnostique ou patient > 60 ans)',
        'Bilan auto-immun (ANA, anti-ADN)',
        'Sérologies (VIH, hépatites)',
        'Échographie abdominale (vérifier absence de splénomégalie)'
      ],
      criteresDiagnostiques: [
        'Thrombopénie isolée (plaquettes < 100 G/L)',
        'Absence de splénomégalie',
        'Myélogramme normal (mégacaryocytes présents)',
        'Absence d\'autre cause de thrombopénie',
        'Diagnostic d\'exclusion'
      ]
    },
    caracteristiquesTherapeutiques: {
      traitementPremiereLigne: [
        'Corticothérapie: prednisone 1 mg/kg/j pendant 3-4 semaines',
        'Immunoglobulines intraveineuses (IgIV) si saignement actif ou plaquettes < 20 G/L',
        'Réduction progressive de la corticothérapie'
      ],
      traitementDeuxiemeLigne: [
        'Splénectomie (si échec corticothérapie)',
        'Rituximab',
        'Agonistes des récepteurs de la thrombopoïétine (eltrombopag, romiplostim)',
        'Immunosuppresseurs (azathioprine, ciclosporine)'
      ],
      protocoles: [
        {
          nom: 'Corticothérapie standard',
          description: 'Prednisone 1 mg/kg/j, réduction progressive sur 3-4 mois',
          indications: ['PTI de première ligne', 'Plaquettes > 20-30 G/L sans saignement actif']
        },
        {
          nom: 'IgIV',
          description: 'Immunoglobulines 1-2 g/kg en 1-2 jours',
          indications: ['Saignement actif', 'Plaquettes < 20 G/L', 'Chirurgie urgente']
        }
      ],
      suivi: [
        'Surveillance des plaquettes hebdomadaire au début',
        'Surveillance clinique des saignements',
        'Ajustement du traitement selon réponse',
        'Surveillance à long terme si évolution chronique'
      ],
      pronostic: 'Chez l\'enfant: 80% de guérison spontanée. Chez l\'adulte: 30% de guérison, 70% d\'évolution chronique. Mortalité par hémorragie cérébrale < 1%.'
    },
    references: [
      'Provan D, et al. Blood 2019',
      'HAS - PTI 2017'
    ],
    miseAJour: '2024-01-30'
  },
  {
    id: '8',
    nom: 'Hémophilie A',
    categorie: 'Coagulopathies',
    description: 'L\'hémophilie A est une maladie hémorragique héréditaire liée au chromosome X, due à un déficit en facteur VIII de la coagulation.',
    caracteristiquesCliniques: {
      symptomes: [
        'Hémarthroses (saignements articulaires) récurrentes',
        'Hématomes musculaires',
        'Saignements prolongés après traumatismes',
        'Hémorragies post-chirurgicales',
        'Hématurie',
        'Hémorragies digestives'
      ],
      signes: [
        'Arthropathie hémophilique (destruction articulaire)',
        'Hématomes rétropéritonéaux',
        'Hématomes intracrâniens (rare mais grave)',
        'Anémie chronique si saignements fréquents'
      ],
      presentation: 'Maladie héréditaire liée à l\'X, touchant les hommes. Femmes conductrices généralement asymptomatiques. Gravité variable selon taux de facteur VIII.',
      evolution: 'Maladie chronique nécessitant un traitement à vie. Avec traitement moderne, qualité de vie et espérance de vie proches de la normale.'
    },
    caracteristiquesBiologiques: {
      hemogramme: {
        description: 'Normal sauf anémie si saignements fréquents',
        anomalies: [
          'Hémogramme normal en dehors des épisodes hémorragiques',
          'Anémie possible si saignements chroniques'
        ]
      },
      marqueurs: [
        'Taux de facteur VIII abaissé',
        'Temps de céphaline activé (TCA) allongé',
        'Temps de Quick normal',
        'Temps de saignement normal',
        'Génétique: mutations du gène F8 (chromosome X)'
      ],
      examensComplementaires: [
        'Dosage du facteur VIII',
        'TCA',
        'Génétique moléculaire (identification de la mutation)',
        'Dépistage des inhibiteurs (anticorps anti-facteur VIII)',
        'Imagerie articulaire (évaluation de l\'arthropathie)'
      ],
      criteresDiagnostiques: [
        'Taux de facteur VIII < 50%',
        'Classification: sévère (< 1%), modérée (1-5%), légère (5-40%)',
        'Antécédents familiaux (mais 30% de mutations de novo)',
        'Génétique: mutation du gène F8'
      ]
    },
    caracteristiquesTherapeutiques: {
      traitementPremiereLigne: [
        'Traitement prophylactique: facteur VIII recombinant ou concentré plasmatique',
        'Traitement à la demande: facteur VIII en cas de saignement',
        'Dosage selon gravité: 2-3 fois/semaine (sévère) à à la demande (légère)'
      ],
      traitementDeuxiemeLigne: [
        'Emicizumab (anticorps bispécifique) en prophylaxie si inhibiteurs',
        'Traitement des inhibiteurs: facteur VII activé recombinant, facteur VIII porcin',
        'Traitement de l\'induction de tolérance (ITI) pour éliminer les inhibiteurs'
      ],
      protocoles: [
        {
          nom: 'Prophylaxie standard',
          description: 'Facteur VIII 20-40 UI/kg 2-3 fois/semaine',
          indications: ['Hémophilie A sévère', 'Prévention des hémarthroses']
        },
        {
          nom: 'Traitement à la demande',
          description: 'Facteur VIII 20-50 UI/kg selon saignement',
          indications: ['Hémophilie A légère à modérée', 'Saignements occasionnels']
        }
      ],
      suivi: [
        'Surveillance du taux de facteur VIII',
        'Dépistage régulier des inhibiteurs (tous les 3-6 mois)',
        'Évaluation de l\'arthropathie (clinique, imagerie)',
        'Éducation du patient (reconnaissance des saignements, auto-traitement)'
      ],
      pronostic: 'Avec traitement moderne: espérance de vie normale, prévention de l\'arthropathie. Risque de développement d\'inhibiteurs: 20-30% des patients sévères. Complications: arthropathie, hémorragies graves.'
    },
    references: [
      'Srivastava A, et al. Haemophilia 2020',
      'WFH Guidelines 2020'
    ],
    miseAJour: '2024-02-15'
  }
];

