//POST
{
  "input": {
    "itemtype": "Ticket",
    "items_id": 326,
    "content": "Raison de la réouverture 2",
    "requesttypes_id": 1
  }
}

//GET
[
    {
        "id": 5,
        "itemtype": "Ticket",
        "items_id": 326,
        "date": "2026-06-09 14:58:55",
        "users_id": 2,
        "users_id_editor": 0,
        "content": "Raison de la réouverture 2",
        "is_private": 0,
        "requesttypes_id": 1,
        "date_mod": "2026-06-09 14:58:55",
        "date_creation": "2026-06-09 14:58:55",
        "timeline_position": 1,
        "sourceitems_id": 0,
        "sourceof_items_id": 0,
        "links": [
            {
                "rel": "Ticket",
                "href": "http://localhost/api.php/v1/Ticket/326"
            },
            {
                "rel": "User",
                "href": "http://localhost/api.php/v1/User/2"
            },
            {
                "rel": "RequestType",
                "href": "http://localhost/api.php/v1/RequestType/1"
            },
            {
                "rel": "Document_Item",
                "href": "http://localhost/api.php/v1/ITILFollowup/5/Document_Item/"
            }
        ]
    }
]