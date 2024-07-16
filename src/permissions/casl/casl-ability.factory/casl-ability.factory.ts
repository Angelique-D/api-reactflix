import { AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "src/permissions/action.enum";

type Subjects = InferSubjects<typeOf User> | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
 createForUser (user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
        PureAbility as AbilityClass<AppAbility>
    );

    if (user.isAdmin) {
        can(Action.Manage, 'all');
    } else {
        can(Action.Read, 'all');
    }

    // Exemple condition Auth
    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build({
        detectSubjectType: (item) =>
            item.constructor as ExtractSubjectType<Subjects>,
    });
 }
}
