//GET

[
  {
    "id": 0,
    "name": "string",
    "content": "string",
    "user_recipient": {
      "id": 0,
      "name": "string"
    },
    "user_editor": {
      "id": 0,
      "name": "string"
    },
    "is_deleted": true,
    "category": {
      "id": 0,
      "name": "string"
    },
    "location": {
      "id": 0,
      "name": "string"
    },
    "urgency": 1,
    "impact": 1,
    "priority": 1,
    "actiontime": 0,
    "begin_waiting_date": "2026-06-05T11:17:48.701Z",
    "waiting_duration": 0,
    "resolution_duration": 0,
    "close_duration": 0,
    "resolution_date": "2026-06-05T11:17:48.701Z",
    "date_creation": "2026-06-05T11:17:48.701Z",
    "date_mod": "2026-06-05T11:17:48.701Z",
    "date": "2026-06-05T11:17:48.701Z",
    "date_solve": "2026-06-05T11:17:48.701Z",
    "date_close": "2026-06-05T11:17:48.701Z",
    "type": 1,
    "external_id": "string",
    "request_type": {
      "id": 0,
      "name": "string"
    },
    "take_into_account_date": "2026-06-05T11:17:48.701Z",
    "take_into_account_duration": 0,
    "sla_ttr": {
      "id": 0,
      "name": "string"
    },
    "sla_tto": {
      "id": 0,
      "name": "string"
    },
    "ola_ttr": {
      "id": 0,
      "name": "string"
    },
    "ola_tto": {
      "id": 0,
      "name": "string"
    },
    "sla_level_ttr": {
      "id": 0,
      "name": "string"
    },
    "ola_level_ttr": {
      "id": 0,
      "name": "string"
    },
    "sla_waiting_duration": 0,
    "ola_waiting_duration": 0,
    "ola_ttr_begin_date": "2026-06-05T11:17:48.701Z",
    "ola_tto_begin_date": "2026-06-05T11:17:48.701Z",
    "internal_resolution_date": "2026-06-05T11:17:48.701Z",
    "internal_take_into_account_date": "2026-06-05T11:17:48.701Z",
    "global_validation": 1,
    "status": {
      "id": 1,
      "name": "string"
    },
    "entity": {
      "id": 0,
      "name": "string",
      "completename": "string"
    },
    "team": [
      {
        "id": 0,
        "name": "string",
        "type": "string",
        "role": "string"
      }
    ],
    "costs": [
      {
        "id": 0
      }
    ]
  }
]

//POST
{
  "name": "string",
  "content": "string",
  "user_recipient": {
    "id": 0
  },
  "user_editor": {
    "id": 0
  },
  "is_deleted": true,
  "category": {
    "id": 0
  },
  "location": {
    "id": 0
  },
  "urgency": 1,
  "impact": 1,
  "priority": 1,
  "resolution_date": "2026-06-05T11:25:38.289Z",
  "date_creation": "2026-06-05T11:25:38.289Z",
  "date_mod": "2026-06-05T11:25:38.289Z",
  "date": "2026-06-05T11:25:38.289Z",
  "date_solve": "2026-06-05T11:25:38.289Z",
  "date_close": "2026-06-05T11:25:38.289Z",
  "type": 1,
  "external_id": "string",
  "request_type": {
    "id": 0
  },
  "take_into_account_date": "2026-06-05T11:25:38.289Z",
  "sla_ttr": {
    "id": 0
  },
  "sla_tto": {
    "id": 0
  },
  "ola_ttr": {
    "id": 0
  },
  "ola_tto": {
    "id": 0
  },
  "sla_level_ttr": {
    "id": 0
  },
  "ola_level_ttr": {
    "id": 0
  },
  "internal_resolution_date": "2026-06-05T11:25:38.289Z",
  "internal_take_into_account_date": "2026-06-05T11:25:38.289Z",
  "global_validation": 1,
  "status": {},
  "entity": {
    "completename": "string"
  },
  "team": [
    {
      "name": "string",
      "type": "string",
      "role": "string"
    }
  ],
  "costs": [
    {}
  ]
}

Ticket/{ticket_id}/Ticket_User  //apiV1
{
  "input": {
    "tickets_id": 1,
    "users_id": 42,
    "type": 1
  }
}

TeamMember // apiV2

Valeur    Rôle
1         Demandeur (Requester) 
2         Technicien assigné (Assigned)
3         Observateur (Observer)