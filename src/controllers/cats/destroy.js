/* ria/prevkonsep
 *
 * /src/controllers/cats/destroy - Controllers for cats deleting
 *
 * Coded by Mucht - Mathieu Claessens
 * started at 14/10/2016
*/

import { db } from "../../core/mongodb";
import { slugify } from "../../core/utils";

export default function( oRequest, oResponse ) {
    db.collection( "cats" )
        .findOne( {
            "slug": slugify( oRequest.params.slug ),
        } )
        .then( ( oCat ) => {
            if ( !oCat ) {
                return oResponse.sendStatus( 404 );
            }

            db.collection( "cats" )
                .deleteOne( {
                    "_id": oCat._id,
                } )
                .then( ( { deletedCount } ) => {
                    if ( deletedCount === 1 ) {
                        return oResponse.sendStatus( 204 );
                    }

                    return oResponse.status( 500 ).json( {
                        "errors": [ "Unknown deletion error" ],
                    } );
                } )
                .catch( ( oError ) => {
                    oResponse.status( 500 ).json( {
                        "errors": [ oError.toString() ],
                    } );
                } );
        } )
        .catch( ( oError ) => {
            oResponse.status( 500 ).json( {
                "errors": [ oError.toString() ],
            } );
        } );
}
