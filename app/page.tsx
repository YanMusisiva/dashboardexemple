// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShoppingBag,
  Package,
  UserCheck,
  DollarSign,
  BarChart3,
  Plus,
  Bell,
  Clock,
  AlertTriangle,
  X,
  Edit2,
  Save,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface Client {
  id: number;
  nom: string;
  telephone: string;
  adresse: string;
  mesures: {
    taille?: number;
    hanches?: number;
    epaule?: number;
    poitrine?: number;
  };
  credit: number;
}

interface Commande {
  id: number;
  clientId: number;
  modele: string;
  tissu: string;
  dateLimit: string;
  statut: "en_attente" | "en_cours" | "termine" | "livre";
  prix: number;
  paye: number;
  tailleur: string;
}

interface StockItem {
  id: number;
  nom: string;
  quantite: number;
  unite: string;
  seuil: number;
  type: string;
}

interface Employe {
  id: number;
  nom: string;
  poste: string;
  tachesActives: number;
  performance: number;
}

interface Notification {
  id: number;
  type: "urgent" | "warning" | "info";
  priority: number;
  client: string;
  commande: string;
  dateLimit: string;
  message: string;
  joursRestants: number;
}

export default function Home() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState<any>({});

  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      nom: "Marie Kouassi",
      telephone: "0707123456",
      adresse: "Abidjan, Cocody",
      mesures: { taille: 165, hanches: 95, epaule: 38, poitrine: 90 },
      credit: 25000,
    },
    {
      id: 2,
      nom: "Jean Bamba",
      telephone: "0708234567",
      adresse: "Abidjan, Yopougon",
      mesures: { taille: 175, hanches: 85, epaule: 42, poitrine: 95 },
      credit: 0,
    },
  ]);

  const [commandes, setCommandes] = useState<Commande[]>([
    {
      id: 1,
      clientId: 1,
      modele: "Robe de soirée",
      tissu: "Satin rouge",
      dateLimit: "2025-10-08",
      statut: "en_cours",
      prix: 45000,
      paye: 20000,
      tailleur: "Alice",
    },
    {
      id: 2,
      clientId: 2,
      modele: "Costume 3 pièces",
      tissu: "Laine grise",
      dateLimit: "2025-10-06",
      statut: "en_attente",
      prix: 85000,
      paye: 85000,
      tailleur: "",
    },
    {
      id: 3,
      clientId: 1,
      modele: "Chemise brodée",
      tissu: "Coton blanc",
      dateLimit: "2025-10-20",
      statut: "en_cours",
      prix: 25000,
      paye: 25000,
      tailleur: "Bernard",
    },
  ]);

  const [stock, setStock] = useState<StockItem[]>([
    {
      id: 1,
      nom: "Satin",
      quantite: 25,
      unite: "mètres",
      seuil: 10,
      type: "tissu",
    },
    {
      id: 2,
      nom: "Boutons dorés",
      quantite: 8,
      unite: "boîtes",
      seuil: 15,
      type: "accessoire",
    },
    {
      id: 3,
      nom: "Fil noir",
      quantite: 45,
      unite: "bobines",
      seuil: 20,
      type: "fourniture",
    },
  ]);

  const [employes, setEmployes] = useState<Employe[]>([
    {
      id: 1,
      nom: "Alice Traoré",
      poste: "Tailleur Senior",
      tachesActives: 3,
      performance: 95,
    },
    {
      id: 2,
      nom: "Bernard Koné",
      poste: "Tailleur",
      tachesActives: 2,
      performance: 88,
    },
  ]);

  const [finances] = useState({
    recettesJour: 45000,
    depensesJour: 12000,
    recettesMois: 1250000,
    depensesMois: 380000,
  });

  const getJoursRestants = (dateLimit: string) => {
    const aujourdhui = new Date("2025-10-05");
    const limite = new Date(dateLimit);
    const diff = Math.ceil(
      (limite.getTime() - aujourdhui.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  const getNotifications = (): Notification[] => {
    const notifications: Notification[] = [];

    commandes.forEach((cmd) => {
      if (cmd.statut !== "livre") {
        const joursRestants = getJoursRestants(cmd.dateLimit);
        const client = clients.find((c) => c.id === cmd.clientId);

        if (joursRestants < 0) {
          notifications.push({
            id: cmd.id,
            type: "urgent",
            priority: 1,
            client: client?.nom || "",
            commande: cmd.modele,
            dateLimit: cmd.dateLimit,
            message: `Retard de ${Math.abs(joursRestants)} jour(s)`,
            joursRestants,
          });
        } else if (joursRestants === 0) {
          notifications.push({
            id: cmd.id,
            type: "urgent",
            priority: 2,
            client: client?.nom || "",
            commande: cmd.modele,
            dateLimit: cmd.dateLimit,
            message: `Deadline AUJOURD'HUI`,
            joursRestants,
          });
        } else if (joursRestants <= 3) {
          notifications.push({
            id: cmd.id,
            type: "warning",
            priority: 3,
            client: client?.nom || "",
            commande: cmd.modele,
            dateLimit: cmd.dateLimit,
            message: `${joursRestants} jour(s) restant(s)`,
            joursRestants,
          });
        } else if (joursRestants <= 7) {
          notifications.push({
            id: cmd.id,
            type: "info",
            priority: 4,
            client: client?.nom || "",
            commande: cmd.modele,
            dateLimit: cmd.dateLimit,
            message: `${joursRestants} jours restants`,
            joursRestants,
          });
        }
      }
    });

    return notifications.sort((a, b) => a.priority - b.priority);
  };

  const notifications = getNotifications();

  useEffect(() => {
    if (notifications.length > 0) {
      setShowNotifications(true);
    }
  }, []);

  const openModal = (type: string, data = {}) => {
    setModalType(type);
    setFormData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleSave = () => {
    if (modalType === "client") {
      if (formData.id) {
        setClients(clients.map((c) => (c.id === formData.id ? formData : c)));
      } else {
        setClients([...clients, { ...formData, id: Date.now() }]);
      }
    } else if (modalType === "commande") {
      if (formData.id) {
        setCommandes(
          commandes.map((c) => (c.id === formData.id ? formData : c))
        );
      } else {
        setCommandes([...commandes, { ...formData, id: Date.now() }]);
      }
    } else if (modalType === "stock") {
      if (formData.id) {
        setStock(stock.map((s) => (s.id === formData.id ? formData : s)));
      } else {
        setStock([...stock, { ...formData, id: Date.now() }]);
      }
    }
    closeModal();
  };

  const modules = [
    { id: "dashboard", nom: "Tableau de bord", icon: BarChart3 },
    { id: "clients", nom: "Clients", icon: Users },
    { id: "commandes", nom: "Commandes", icon: ShoppingBag },
    { id: "stock", nom: "Stock", icon: Package },
    { id: "employes", nom: "Employés", icon: UserCheck },
    { id: "finances", nom: "Finances", icon: DollarSign },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
    <div className="bg-white border border-black/5 rounded-lg p-6 hover:border-red-600/20 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-black">{value}</h3>
          {subtitle && <p className="text-gray-400 text-sm mt-2">{subtitle}</p>}
        </div>
        <div className="p-3 bg-black rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center text-sm text-red-600 font-medium">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => {
    if (!showNotifications || notifications.length === 0) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-black/10 animate-slideUp">
          <div className="bg-black text-white p-8 border-b border-red-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-4 bg-red-600 rounded-xl mr-4 animate-pulse">
                  <Bell className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Alertes Deadlines</h2>
                  <p className="text-gray-300 text-sm">
                    {notifications.length} commande(s) nécessitent votre
                    attention
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-200px)] p-6 space-y-3 bg-gray-50">
            {notifications.map((notif, idx) => (
              <div
                key={notif.id}
                className={`rounded-xl p-6 border-l-4 shadow-md hover:shadow-xl transition-all bg-white ${
                  notif.type === "urgent"
                    ? "border-red-600"
                    : notif.type === "warning"
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`p-3 rounded-lg mr-4 ${
                      notif.type === "urgent" ? "bg-red-50" : "bg-gray-50"
                    }`}
                  >
                    {notif.type === "urgent" ? (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-black" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-black text-lg mb-1">
                          {notif.client}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {notif.commande}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                          notif.type === "urgent"
                            ? "bg-red-600 text-white"
                            : "bg-black text-white"
                        }`}
                      >
                        {notif.message}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        Date limite:{" "}
                        <strong className="text-black">
                          {new Date(notif.dateLimit).toLocaleDateString(
                            "fr-FR",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 border-t border-black/5">
            <button
              onClick={() => {
                setShowNotifications(false);
                setActiveModule("commandes");
              }}
              className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-red-600 transition-all"
            >
              Voir toutes les commandes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Commandes actives"
          value={commandes.filter((c) => c.statut !== "livre").length}
          subtitle={`${commandes.length} au total`}
          icon={ShoppingBag}
          trend="+12% ce mois"
        />
        <StatCard
          title="Recettes du mois"
          value={`${(finances.recettesMois / 1000).toFixed(0)}k FCFA`}
          subtitle={`${
            finances.recettesJour
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA"
          } aujourd'hui`}
          icon={DollarSign}
          trend="+8% vs mois dernier"
        />
        <StatCard
          title="Clients actifs"
          value={clients.length}
          subtitle={`${clients.filter((c) => c.credit > 0).length} avec crédit`}
          icon={Users}
          trend="+5 nouveaux"
        />
        <StatCard
          title="Alertes stock"
          value={stock.filter((s) => s.quantite < s.seuil).length}
          subtitle="Articles faibles"
          icon={AlertCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-black/5 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-red-600" />
            Commandes récentes
          </h3>
          <div className="space-y-3">
            {commandes.slice(0, 3).map((cmd) => {
              const client = clients.find((c) => c.id === cmd.clientId);
              return (
                <div
                  key={cmd.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-black/5"
                >
                  <div>
                    <p className="font-semibold text-black">{client?.nom}</p>
                    <p className="text-sm text-gray-600">{cmd.modele}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cmd.statut === "livre"
                        ? "bg-black text-white"
                        : cmd.statut === "en_cours"
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {cmd.statut.replace("_", " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            Alertes stock
          </h3>
          <div className="space-y-3">
            {stock
              .filter((s) => s.quantite < s.seuil)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200"
                >
                  <div>
                    <p className="font-semibold text-black">{item.nom}</p>
                    <p className="text-sm text-gray-600">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      {item.quantite} {item.unite}
                    </p>
                    <p className="text-xs text-gray-500">Seuil: {item.seuil}</p>
                  </div>
                </div>
              ))}
            {stock.filter((s) => s.quantite < s.seuil).length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Aucune alerte stock
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Gestion des Clients</h2>
        <button
          onClick={() =>
            openModal("client", {
              nom: "",
              telephone: "",
              adresse: "",
              mesures: {},
              credit: 0,
            })
          }
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Nouveau Client
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white border border-black/5 rounded-lg shadow-md p-6 hover:border-red-600/20 hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-black">{client.nom}</h3>
                <p className="text-gray-600">{client.telephone}</p>
                <p className="text-sm text-gray-500">{client.adresse}</p>
              </div>
              <button
                onClick={() => openModal("client", client)}
                className="text-black hover:text-red-600"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-black/5">
                <p className="text-xs text-gray-600 mb-1">Taille</p>
                <p className="font-semibold text-black">
                  {client.mesures.taille} cm
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-black/5">
                <p className="text-xs text-gray-600 mb-1">Hanches</p>
                <p className="font-semibold text-black">
                  {client.mesures.hanches} cm
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-black/5">
                <p className="text-xs text-gray-600 mb-1">Épaule</p>
                <p className="font-semibold text-black">
                  {client.mesures.epaule} cm
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-black/5">
                <p className="text-xs text-gray-600 mb-1">Poitrine</p>
                <p className="font-semibold text-black">
                  {client.mesures.poitrine} cm
                </p>
              </div>
            </div>
            {client.credit > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">
                  Crédit restant:{" "}
                  <span className="font-bold">
                    {client.credit.toLocaleString()} FCFA
                  </span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommandes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Gestion des Commandes</h2>
        <button
          onClick={() =>
            openModal("commande", {
              clientId: "",
              modele: "",
              tissu: "",
              dateLimit: "",
              statut: "en_attente",
              prix: 0,
              paye: 0,
              tailleur: "",
            })
          }
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Nouvelle Commande
        </button>
      </div>
      <div className="bg-white border border-black/5 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-black/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Client
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Modèle
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Date limite
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Statut
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Prix / Payé
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Tailleur
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {commandes.map((cmd, idx) => {
              const client = clients.find((c) => c.id === cmd.clientId);
              return (
                <tr
                  key={cmd.id}
                  className={`border-t border-black/5 hover:bg-gray-50 transition-colors`}
                >
                  <td className="px-6 py-4 font-medium text-black">
                    {client?.nom || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-black">{cmd.modele}</p>
                      <p className="text-sm text-gray-500">{cmd.tissu}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{cmd.dateLimit}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cmd.statut === "livre"
                          ? "bg-black text-white"
                          : cmd.statut === "en_cours"
                          ? "bg-red-600 text-white"
                          : cmd.statut === "termine"
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {cmd.statut.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-black">
                        {cmd.prix.toLocaleString()} FCFA
                      </p>
                      <p className="text-sm text-gray-500">
                        {cmd.paye.toLocaleString()} payé
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {cmd.tailleur || "Non assigné"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openModal("commande", cmd)}
                      className="text-black hover:text-red-600"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStock = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Gestion du Stock</h2>
        <button
          onClick={() =>
            openModal("stock", {
              nom: "",
              quantite: 0,
              unite: "",
              seuil: 0,
              type: "",
            })
          }
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-all flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Ajouter Article
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stock.map((item) => (
          <div
            key={item.id}
            className={`rounded-lg shadow-md p-6 hover:shadow-xl transition-all ${
              item.quantite < item.seuil
                ? "bg-red-50 border-2 border-red-600"
                : "bg-white border border-black/5"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-black">{item.nom}</h3>
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 mt-2">
                  {item.type}
                </span>
              </div>
              <button
                onClick={() => openModal("stock", item)}
                className="text-black hover:text-red-600"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quantité</span>
                <span
                  className={`font-bold text-lg ${
                    item.quantite < item.seuil ? "text-red-600" : "text-black"
                  }`}
                >
                  {item.quantite} {item.unite}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Seuil d'alerte</span>
                <span className="font-semibold text-gray-700">
                  {item.seuil} {item.unite}
                </span>
              </div>
              {item.quantite < item.seuil && (
                <div className="flex items-center text-red-600 text-sm font-medium pt-2 border-t border-red-200">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Stock faible - Réapprovisionner
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmployes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Gestion des Employés</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employes.map((emp) => (
          <div
            key={emp.id}
            className="bg-white border border-black/5 rounded-lg shadow-md p-6 hover:border-red-600/20 hover:shadow-xl transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                {emp.nom.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">{emp.nom}</h3>
                <p className="text-gray-600">{emp.poste}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-black/5">
                <p className="text-sm text-gray-600 mb-1">Tâches actives</p>
                <p className="text-2xl font-bold text-black">
                  {emp.tachesActives}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-black/5">
                <p className="text-sm text-gray-600 mb-2">Performance</p>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                    <div
                      className="bg-red-600 h-3 rounded-full transition-all"
                      style={{ width: `${emp.performance}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-black">
                    {emp.performance}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFinances = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-black">Finances & Caisse</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-lg font-medium mb-6 opacity-90">Recettes</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm opacity-75 mb-1">Aujourd'hui</p>
              <p className="text-4xl font-bold">
                {finances.recettesJour.toLocaleString()} FCFA
              </p>
            </div>
            <div className="border-t border-white/20 pt-4">
              <p className="text-sm opacity-75 mb-1">Ce mois</p>
              <p className="text-3xl font-bold">
                {finances.recettesMois.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-600 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-lg font-medium mb-6 opacity-90">Dépenses</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm opacity-75 mb-1">Aujourd'hui</p>
              <p className="text-4xl font-bold">
                {finances.depensesJour.toLocaleString()} FCFA
              </p>
            </div>
            <div className="border-t border-white/20 pt-4">
              <p className="text-sm opacity-75 mb-1">Ce mois</p>
              <p className="text-3xl font-bold">
                {finances.depensesMois.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-black/5 rounded-lg shadow-md p-8">
        <h3 className="text-xl font-bold text-black mb-6">Bilan mensuel</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-black/5">
            <p className="text-sm text-gray-600 mb-2">Bénéfice net</p>
            <p className="text-3xl font-bold text-black">
              {(finances.recettesMois - finances.depensesMois).toLocaleString()}{" "}
              FCFA
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-black/5">
            <p className="text-sm text-gray-600 mb-2">Marge</p>
            <p className="text-3xl font-bold text-black">
              {(
                ((finances.recettesMois - finances.depensesMois) /
                  finances.recettesMois) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-black/5">
            <p className="text-sm text-gray-600 mb-2">Commandes payées</p>
            <p className="text-3xl font-bold text-black">
              {commandes.filter((c) => c.paye >= c.prix).length}/
              {commandes.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-black text-white p-6 flex justify-between items-center rounded-t-2xl">
            <h3 className="text-2xl font-bold">
              {formData.id ? "Modifier" : "Nouveau"} {modalType}
            </h3>
            <button
              onClick={closeModal}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {modalType === "client" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={formData.telephone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Adresse"
                  value={formData.adresse || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, adresse: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Taille (cm)"
                    value={formData.mesures?.taille || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mesures: {
                          ...formData.mesures,
                          taille: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Hanches (cm)"
                    value={formData.mesures?.hanches || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mesures: {
                          ...formData.mesures,
                          hanches: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Épaule (cm)"
                    value={formData.mesures?.epaule || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mesures: {
                          ...formData.mesures,
                          epaule: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Poitrine (cm)"
                    value={formData.mesures?.poitrine || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mesures: {
                          ...formData.mesures,
                          poitrine: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Crédit (FCFA)"
                  value={formData.credit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credit: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            )}
            {modalType === "commande" && (
              <div className="space-y-4">
                <select
                  value={formData.clientId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clientId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Modèle"
                  value={formData.modele || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, modele: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Tissu"
                  value={formData.tissu || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tissu: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <input
                  type="date"
                  placeholder="Date limite"
                  value={formData.dateLimit || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dateLimit: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <select
                  value={formData.statut || "en_attente"}
                  onChange={(e) =>
                    setFormData({ ...formData, statut: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="en_attente">En attente</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="livre">Livré</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Prix (FCFA)"
                    value={formData.prix || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prix: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Payé (FCFA)"
                    value={formData.paye || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paye: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <select
                  value={formData.tailleur || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tailleur: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Assigner à un tailleur</option>
                  {employes.map((emp) => (
                    <option key={emp.id} value={emp.nom}>
                      {emp.nom}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {modalType === "stock" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom de l'article"
                  value={formData.nom || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
                <select
                  value={formData.type || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Type d'article</option>
                  <option value="tissu">Tissu</option>
                  <option value="accessoire">Accessoire</option>
                  <option value="fourniture">Fourniture</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Quantité"
                    value={formData.quantite || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantite: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Unité"
                    value={formData.unite || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, unite: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Seuil d'alerte"
                  value={formData.seuil || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seuil: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-all flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                Enregistrer
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}</style>

      {renderNotifications()}
      {renderModal()}

      <div className="bg-white border-b border-black/10 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black tracking-tight">
                Atelier Couture
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Système de gestion premium
              </p>
            </div>
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-4 bg-black text-white rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
            >
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center animate-pulse border-2 border-white">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeModule === module.id
                    ? "bg-black text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-black/10"
                }`}
              >
                <module.icon className="w-5 h-5 mr-2" />
                {module.nom}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {activeModule === "dashboard" && renderDashboard()}
        {activeModule === "clients" && renderClients()}
        {activeModule === "commandes" && renderCommandes()}
        {activeModule === "stock" && renderStock()}
        {activeModule === "employes" && renderEmployes()}
        {activeModule === "finances" && renderFinances()}
      </div>
    </div>
  );
}
